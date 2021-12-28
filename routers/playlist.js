const playlistRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const User = require("../models/userSchema")
const bodyParser = require('body-parser');
const { ensureAuthenticated } = require('../config/auth');
const Playlist = require("../models/playlistSchema")
const Song = require("../models/songSchema");
const indexRouter = require('.');

playlistRouter.get("/new", ensureAuthenticated, (req, res) => {
    res.render("playlist", { title: "New Playlist", description: "New Playlist", user: req.user })
})

playlistRouter.post("/new", ensureAuthenticated, (req, res) => {
    let id = uuidv4();
    User.findOne({
        userId: req.user.userId
    }, (err, doc) => {
        console.log(doc)
        let playlist = new Playlist({
            name: req.body.name,
            id: id,
            songs: []
        })
        doc.playlists.push(playlist)
        doc.save().then(() => { res.redirect("/playlist/" + id) });
    })

})

playlistRouter.get("/all", ensureAuthenticated, (req, res) => {
    User.findOne(req.user, (err, doc) => {
        res.send(doc.playlists[0].name)
    })
})

playlistRouter.get("/:id/add/:songid", ensureAuthenticated, (req, res) => {
    // let playlistId = req.params.id
    User.findOne(req.user, (err, doc) => {
        Song.findOne({ id: req.params.songid }, (err, doc1) => {
            let index = doc.playlists.findIndex(x => x.name == req.params.id)
            if (doc.playlists[index].songs.includes(req.params.songid)) {
                res.send("Song already exists in playlist")
            } else {
                doc.playlists[index].songs.push(req.params.songid)
                doc.save()
                    .then(res.send(doc))
            }
        })
    })
})

playlistRouter.get("/:id/delete/:songid", ensureAuthenticated, (req, res) => {
    User.findOne(req.user, (err, doc) => {
        Song.findOne({ id: req.params.songid }, (err, doc1) => {
            let index = doc.playlists.findIndex(x => x.name == req.params.id)
            if (!doc.playlists[index].songs.includes(req.params.songid)) {
                res.send("Song not in playlist")
            } else {
                doc.playlists[index].songs = doc.playlists[index].songs.filter(x => x != req.params.songid)
                doc.save()
                    .then(res.send(doc))
            }
        })
    })
})

playlistRouter.get("/:id/allsongid", ensureAuthenticated, async (req, res) => {
    User.findOne({ username: req.user.username }, async (err, doc) => {
        if (doc) {
            if (req.params.id != 'liked') {
                let index = doc.playlists.findIndex(x => x.id == req.params.id)
                res.send(doc.playlists[index].songs.map(x => x))
            } else {
                res.send(doc.liked.map(x => x))
            }
        }
        else {
            res.send("No such playlist")
        }
    })
})

playlistRouter.get('/:id', ensureAuthenticated, async (req, res) => {
    User.findOne({ username: req.user.username }, async (err, doc) => {
        let index = doc.playlists.findIndex(x => x.id == req.params.id)
        if (doc.playlists[index].songs.length > 0) {
            await Promise.all(
                doc.playlists[index].songs.map(song_id => {
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
                    res.render("playlistView", {
                        title: "playlistView",
                        description: "playlistView",
                        user: req.user,
                        songs: songs,
                        playlist: doc.playlists[index]
                    })
                })
        }
        else {
            res.render("playlistView", {
                title: "playlistView",
                description: "playlistView",
                user: req.user,
                songs: [],
                playlist: doc.playlists[index]
            })
        }
    })
})

module.exports = playlistRouter;

