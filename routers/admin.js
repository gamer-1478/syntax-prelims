const adminRouter = require('express').Router();
const Song = require("../models/songSchema")

adminRouter.get("/test", (req, res, next)=>{

    const newSong = new Song({
        name:"Heat Waves",
        artist: "Glass Animals",
        id: "heat_waves",
        time: 235,
        genre: "Pop"
    })

    newSong.save()

    res.send("Hello world")
})

module.exports = adminRouter;