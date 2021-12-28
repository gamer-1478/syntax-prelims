const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const reqString = { type:String, required:true }
const moment = require("moment")
let now = new Date()
let dateStringWithTime = moment(now).format('YYYY-MM-DD HH:MM:SS');
const playlistSchema = new mongoose.Schema({
    name: reqString,
    id: reqString,
    songs: {type: Array, required: true},
    date: {
        type:String,
        default: dateStringWithTime
    },
})


const userSchema = new mongoose.Schema({
    email:reqString, 
    username:reqString,
    password:reqString,
    date: {
        type:String,
        default: dateStringWithTime
    },
    userId: reqString,
    liked: {type:Array, required:true},
    recentlyPlayed: {type:Array, required:true},
    playlists: [playlistSchema]
    
})


userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)
