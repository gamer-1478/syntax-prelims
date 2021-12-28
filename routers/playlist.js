const playlistRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const User = require("../models/userSchema")
const bodyParser = require('body-parser');
const { ensureAuthenticated } = require('../config/auth');
const Playlist = require("../models/playlistSchema")

playlistRouter.get("/new", ensureAuthenticated, (req, res)=>{
    res.render("playlist")
})

playlistRouter.post("/new", ensureAuthenticated, (req, res)=>{
    let id = uuidv4();
    User.findOne({id:req.user.id}, (err, doc)=>{
        let playlist = new Playlist({
            name:req.body.name,
            id:id,
            songs:[]
        })
        doc.playlists.push(playlist)
        doc.save();
    })
   
    res.sendStatus(200)
})

playlistRouter.get("/all", ensureAuthenticated, (req, res)=>{
    User.findOne(req.user, (err, doc)=>{
        res.send(doc.playlist.name)
    })
})

module.exports = playlistRouter;