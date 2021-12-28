const playlistRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const User = require("../models/userSchema")
const bodyParser = require('body-parser');
const { ensureAuthenticated } = require('../config/auth');
const Playlist = require("../models/playlistSchema")
const Song = require("../models/songSchema")

playlistRouter.get("/new", ensureAuthenticated, (req, res) => {
    res.render("playlist")
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
        doc.save();
    })
    res.sendStatus(200)
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


module.exports = playlistRouter;

