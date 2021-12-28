const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/userSchema');

const profileRouter = require('express').Router();

profileRouter.get("/", ensureAuthenticated, (req, res)=>{
    User.findOne(req.user, (err,doc)=>{
        if(err){
            res.send(err)
        }else{
            let username = doc.username;
            let email = doc.email;
            let liked = doc.liked
            res.render("profile", {user:req.user, username, email, liked})
        }
    })
})

module.exports = profileRouter;