const indexRouter = require('express').Router();

indexRouter.get('/', (req, res) => {
    res.render('index')
});

//export routers
module.exports = indexRouter;