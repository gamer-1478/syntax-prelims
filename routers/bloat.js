//index router
const bloatRouter = require('express').Router();
const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors');

//serve public folder
bloatRouter.use(express.static('public'));

//cors middleware
const whitelist = ['http://localhost:3000', 'syntax-prelims.herokuapp.com']
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(origin)
            callback(new Error("Not allowed by CORS"))
        }
    }
}
bloatRouter.use(cors(corsOptions))

// Allowed hosts
const allowedHosts = ['localhost', 'syntax-prelims.herokuapp.com'];
const checkHosts = (req, res, next) => {
    if (allowedHosts.includes(req.hostname)) {
        return next();
    }
    return res.sendStatus(403);
}
bloatRouter.use(checkHosts);

//body parsers 
bloatRouter.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb'
}));
bloatRouter.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

//export routers
module.exports = bloatRouter;