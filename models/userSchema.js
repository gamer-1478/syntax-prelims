const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const reqString = { type:String, required:true }
const moment = require("moment")
let now = new Date()
let dateStringWithTime = moment(now).format('YYYY-MM-DD HH:MM:SS');

const userSchema = new mongoose.Schema({
    email:reqString, 
    username:reqString,
    password:reqString,
    date: {
        type:String,
        default: dateStringWithTime
    },
    userId: reqString
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)
