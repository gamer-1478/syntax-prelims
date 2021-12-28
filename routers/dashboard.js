const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

router.get("/", ensureAuthenticated, (req, res, next)=>{
    res.render("dashboard", {title: "Dashboard", description: "Dashboard", user:req.user})
})

module.exports = router;