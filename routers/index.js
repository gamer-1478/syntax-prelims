const indexRouter = require('express').Router();
const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs');

indexRouter.get('/', (req, res) => {
    var loggedIn = false;
    if (req.user != null) {
        loggedIn = true;
    }
    res.render('index', { title: "Home", description: "Home", loggedIn: loggedIn });
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

//export routers
module.exports = indexRouter;