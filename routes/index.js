'use strict'; 
var express = require('express');
var router = express.Router();
var authMiddleware = require('../config/auth');
var Album = require('../models/album');
var Image = require('../models/image');
var User = require('../models/user');



router.get('/', authMiddleware, function(req, res, next) {
  console.log("User: ", req.user);
  res.render('index', { 
    title: "Welcome to Image Albums", 
    user: req.user, 
    state: "home"});
});

router.get('/login', function(req, res, next) {
  res.render('form', {state: 'login', title: "Login"});
});

router.get('/register', function(req, res, next) {
  res.render('form', {state: 'register', title: "Register"});
});


// go to add album form 
router.get('/addAlbum', authMiddleware, function(req, res, next) {
  console.log("User: ", req.user);
  res.render('addAlbum', { user: req.user});
});

// go to add image form 
router.get('/addImage/:album', authMiddleware, function(req, res, next) {
  console.log("User: ", req.user);
  res.render('addImage', { user: req.user, album: req.params.album });
});


// go to favorite images
router.get('/faveImages', authMiddleware, function(req, res, next) {
  console.log("User: ", req.user);
  User.findById(req.user._id).populate('faveimages')
  .exec(function(err, user){
    
    res.render('showpage', { 
      user: user, state: "faveimages",
    });
  });
});



module.exports = router;
