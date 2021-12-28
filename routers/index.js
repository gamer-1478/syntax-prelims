const indexRouter = require('express').Router();
const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    Song = require("../models/songSchema");

indexRouter.get('/', (req, res) => {
    res.render('index', { title: "Home", description: "Home", user: req.user });
});

indexRouter.get('/song_stream/:id', (req, res) => {
    const filePath = path.join(__dirname, '../songs/' + req.params.id + '.mp3');
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
})

indexRouter.get('/play/:id', async (req, res) => {
    if (req.params.id.length > 0) {
        Song.findOne({ id: req.params.id }, function (err, doc) {
            res.render('play', { title: "Play", description: "Play", user: req.user, id: req.params.id, song_doc: doc });
            if (err) res.send(err)
        })
    } else {
        res.redirect('/dashboard');
    }
})

//export routers
module.exports = indexRouter;