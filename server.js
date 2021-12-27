require('dotenv').config()

const express = require('express'),
    app = express(),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 3000,
    bloatRouter = require('./routers/bloat'),
    indexRouter = require('./routers/index');

//ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//mongo
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_USER = process.env.MONGO_USER
const MONGO_CLUSTER_URL = process.env.MONGO_CLUSTER_URL
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME
const mongoURI =  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER_URL}/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`



app.use('/', bloatRouter);
app.use('/', indexRouter);

mongoose.connect(String(mongoURI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log('Connected to Mongo DB')

    app.listen(PORT, err => {
        console.log(`App listening on http://localhost:${PORT}`)
        if (err) throw err
    })
}).catch((err) => console.log(err))

