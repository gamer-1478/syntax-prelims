const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Song = require("../models/songSchema");

router.get("/", ensureAuthenticated, async (req, res, next) => {
    if (req.user.recentlyPlayed.length > 0) {
        await Promise.all(
            req.user.recentlyPlayed.map(song_id => {
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
                res.render("dashboard", {
                    title: "Dashboard",
                    description: "Dashboard",
                    user: req.user,
                    songs: songs
                })
            })
    }
    else {
        res.render("dashboard", {
            title: "Dashboard",
            description: "Dashboard",
            user: req.user,
            songs: []
        })
    }
})

module.exports = router;