const adminRouter = require('express').Router();
const Song = require("../models/songSchema")

adminRouter.get("/test", (req, res, next)=>{

    // const newSong = new Song({
    //     name:"Leave The Door Open",
    //     artist: "Bruno Mars, Anderson Paak",
    //     id: "leave_the_door_open",
    //     time: 263,
    //     genre: "R&B"
    // })

    // newSong.save()

    res.send("Hello world")
})

module.exports = adminRouter;