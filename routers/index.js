const indexRouter = require('express').Router();

indexRouter.get('/', (req, res) => {
    res.render('index', { title: "Home", description: "Home" })
});

//export routers
module.exports = indexRouter;