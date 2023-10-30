const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('../routes/auth');
const youtubeRouter = require('../routes/youtubeSearch');

const server = express();
const db = mongoose.connect('mongodb://127.0.0.1:27017/youtube');

server.listen(5000);
server.use(cookieParser());


// view engine setup
server.set('views', path.join(__dirname, '../views'));
server.set('view engine', 'ejs');


server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(express.static(path.join(__dirname, '../public')));


server.use('/auth', authRouter);
server.use('/youtube', youtubeRouter);
// catch 404 and forward to error handler
server.use(function(req, res, next) {
    next(createError(404));
});

// error handler
server.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = server;