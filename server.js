require('dotenv').config()

const express = require('express'),
    app = express(),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 3000,
    bloatRouter = require('./routers/bloat'),
    indexRouter = require('./routers/index'),
    adminRouter = require("./routers/admin"),
    authRouter = require("./routers/auth"),
    dashboardRouter = require("./routers/dashboard");
//ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//passportJs
const session = require("express-session");
const passport = require('passport');
app.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true
}));

require('./config/passport')(passport);

//mongo
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_USER = process.env.MONGO_USER
const MONGO_CLUSTER_URL = process.env.MONGO_CLUSTER_URL
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME
const db = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER_URL}/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`

//initializing passport
app.use(passport.initialize());
app.use(passport.session());



app.use('/', bloatRouter);
app.use('/', indexRouter);
app.use("/admin", adminRouter)
app.use("/auth", authRouter)
app.use("/dashboard", dashboardRouter)

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongo DB")
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}).catch(err => console.log(err))
