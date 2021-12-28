const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../config/auth");
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const User = require("../models/userSchema") 
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require('uuid');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', { title: "Login", description: "Login" })
});

// Register Page
router.get("/register", forwardAuthenticated, (req, res) => {
    res.render("register", { title: "Register", description: "Register" });
})

// Register
router.post("/register", async (req, res) => {
    let errors = [];
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        errors.push({ msg: "Please Fill in all the fields" })
    }

    if (username.length < 5 || username.length > 17) {
        errors.push({ msg: "username should be in between 6 and 16 characters" })
    }

    if (password.length < 5 || password.length > 17) {
        errors.push({ msg: "Password should be in between 6 and 16 characters" })
    }

    if (errors.length > 0) {
        res.render("register", { errors, title: "Register", description: "Register" })
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: "User already exists, try logging in instead." })
                    res.render("register", { errors, title: "Register", description: "Register" })
                } else {
                    let userId = uuidv4();
                    const newUser = new User({
                        "username": username,
                        "email": email,
                        "password": password,
                        "userId": userId
                    })
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err

                        newUser.password = hash;

                        newUser.save()
                            .then(user => {
                                res.redirect("/login")
                            })
                            .catch(err => console.log(err));
                    }))
                }
            })
    }
})

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })(req, res, next);
})

// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
