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


app.use('/', bloatRouter);
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})