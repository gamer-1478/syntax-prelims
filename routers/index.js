const indexRouter = require('express').Router();
const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    User = require("../models/userSchema"),
    Song = require("../models/songSchema");
const { ensureAuthenticated } = require('../config/auth');


indexRouter.get('/', (req, res) => {
    res.render('index', { title: "Home", description: "Home", user: req.user });
});

indexRouter.get('/song_stream/:id', ensureAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../songs/' + req.params.id + '.mp3');
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
    User.findOne({ username: req.user.username }, function (err, doc1) {
        if (doc1.recentlyPlayed.includes(req.params.id)) {
            doc1.recentlyPlayed = doc1.recentlyPlayed.filter(i => i !== req.params.id);
            doc1.recentlyPlayed.push(req.params.id);
        } else {
            doc1.recentlyPlayed.push(req.params.id);
        }
        if (doc1.recentlyPlayed.length > 6) {
            doc1.recentlyPlayed = doc1.recentlyPlayed.splice(doc1.recentlyPlayed.length - 6, doc1.recentlyPlayed.length)
        }
        doc1.save();
    });
})

indexRouter.get('/song_details/:id', ensureAuthenticated, (req, res) => {
    Song.findOne({ id: req.params.id }, (err, doc) => {
        res.send(doc)
    })
})

indexRouter.get('/search', ensureAuthenticated, (req, res) => {
    Song.find().then((result) => {
        res.render('search', { title: "Search", description: "Search", user: req.user, songs: result })
    })
})

indexRouter.post('/search', ensureAuthenticated, (req, res) => {
    Song.find({ $or: [{ name: { '$regex': req.body.query, "$options": "i" } }] }).then((result) => {
        res.render('search', { title: "Search", description: "Search", user: req.user, songs: result });

    })
})

indexRouter.get('/play/:id', ensureAuthenticated, async (req, res) => {
    if (req.params.id.length > 0) {
        Song.findOne({ id: req.params.id }, function (err, doc) {
            if (doc != null) {
                Song.count().exec(function (err, count) {
                    var liked = false;
                    if (req.user.liked.includes(req.params.id)) {
                        liked = true;
                    }
                    var random = Math.floor(Math.random() * count)
                    Song.findOne().skip(random).exec(
                        function (err, result) {
                            res.render('play', { title: "Play", description: "Play", user: req.user, id: req.params.id, song_doc: doc, up_next_doc: result, liked: liked });
                        })
                })
            } else {
                res.send("Not a valid song id")
            }
            if (err) res.send(err)
        })
    } else {
        res.redirect('/dashboard');
    }
});

indexRouter.get('/likedSongs', ensureAuthenticated, async (req, res) => {
    User.findOne({ username: req.user.username }, async (err, doc) => {
        if (doc.liked.length > 0) {

            await Promise.all(
                doc.liked.map(song_id => {
                    return new Promise((resolve, reject) => {
                        Song.findOne({ id: song_id }, function (err, doc) {
                            if (err) {
                                reject(err)
                            }
                            if (doc) {
                                resolve(doc)
                            }
                        })
                    })
                })).then(async (songs) => {
                    res.render("LikedSongs", {
                        title: "LikedSongs",
                        description: "LikedSongs",
                        user: req.user,
                        songs: songs,
                        playlist: doc.liked
                    })
                })
        }
        else {
            res.render("LikedSongs", {
                title: "LikedSongs",
                description: "LikedSongs",
                user: req.user,
                songs: [],
                playlist: doc.liked
            })
        }
    })
});

indexRouter.get("/like/:id", ensureAuthenticated, async (req, res) => {
    if (req.params.id.length > 0) {
        try {
            User.findOne({ username: req.user.username }, (err, doc1) => {
                if (err) {
                    res.send(err)
                } else {
                    Song.findOne({ id: req.params.id }, function (err, doc) {
                        if (err) throw err;
                        if (doc) {
                            if (!doc1.liked.includes(doc.id)) {
                                doc1.liked.push(doc.id)
                                res.send(doc1.liked)
                                doc1.save()
                            } else {
                                res.send({ message: "already liked" })
                            }
                        }
                        else {
                            res.send({ error: "this song is not in our database, pls try a valid id" })
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err)
            res.send({ error: "either our service is down, or this song is not in our database" })
        }
    }
})

indexRouter.get('/remove_like/:id', ensureAuthenticated, async (req, res) => {
    if (req.params.id.length > 0) {
        try {
            User.findOne({ username: req.user.username }, (err, doc1) => {
                if (err) { throw err };
                Song.findOne({ id: req.params.id }, async function (err, doc) {
                    if (doc) {
                        if (doc1.liked.includes(doc.id)) {
                            doc1.liked = doc1.liked.filter(i => i !== doc.id);
                            res.send(doc1.liked)
                            doc1.save()
                        } else {
                            res.send({ message: "Not Liked" })
                        }
                    }
                    else {
                        res.send({ error: "this song is not in our database, pls try a valid id" })
                    }
                })
            })
        } catch (err) {
            console.log(err)
            res.send({ error: "either our service is down, or this song is not in our database" })
        }
    }
})
//export routers
module.exports = indexRouter;