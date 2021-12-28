const adminRouter = require('express').Router();
const Song = require("../models/songSchema")

adminRouter.get("/test", (req, res, next)=>{

    // const newSong = new Song({
    //     name:"Without You",
    //     artist: "The Kid LAROI",
    //     id: "without_you",
    //     time: 161,
    //     genre: "Pop"
    // })

    // newSong.save()

    res.send("Hello world")
})

module.exports = adminRouter;