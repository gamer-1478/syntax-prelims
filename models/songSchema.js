const mongoose = require("mongoose")
const reqString = { type:String, required:true }

const songSchema = new mongoose.Schema({
    name: reqString,
    artist: reqString,
    id: reqString,
    time: {
        type:Number,
        required:true
    },
    genre: {
        type:String,
        required: false
    }
})

module.exports = mongoose.model("Song", songSchema)
