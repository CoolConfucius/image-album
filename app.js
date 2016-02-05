'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/imagealbums'
var mongoose = require('mongoose');
mongoose.connect(mongoUrl, function(err) {
  console.log(err || `Connected to MongoDB: ${mongoUrl}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', require('./routes/users'));
app.use('/albums', require('./routes/albums'));
app.use('/images', require('./routes/images'));
app.use('/faves', require('./routes/faves'));
app.use('/', require('./routes/index'));

// catch 404 and handle error 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
