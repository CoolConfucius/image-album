'use strict'; 
var express = require('express');
var router = express.Router();
var async = require('async'); 
var authMiddleware = require('../config/auth');
var Album = require('../models/album');
var Image = require('../models/image');
var User = require('../models/user');
router.use(authMiddleware);

// Sorting: 
router.get('/sorttitle/:num', function(req, res, next) {
  User.find({'_id': { $ne: req.user._id}}).populate('albums').exec(function(err, users){
    // console.log(users, "USERS");
    if(err) return res.status(400).send(err); 
    var albums = []; 
    users.forEach(function(entry){
      entry.albums.forEach(function(album){
        if (!album.private) {
          album.user = entry._id;
          album.owner = entry.email;           
          albums.push(album);
        };
      })
    });
    albums = albums.sort(function(a, b){
      if (req.params.num === "-1") {
        if (a.title > b.title)
          return 1;
        else if (a.title < b.title)
          return -1;
        else 
          return 0;
      } else {
        if (a.title > b.title)
          return -1;
        else if (a.title < b.title)
          return 1;
        else 
          return 0;
      }
    });
    res.render('index', { 
      title: "Sorting by Title", user: req.user, albums: albums, state: "albums"
    });
  });
});


router.get('/sortdate/:num', function(req, res, next) {
  User.find({'_id': { $ne: req.user._id}}).populate('albums').exec(function(err, users){
    // console.log(users, "USERS");
    if(err) return res.status(400).send(err); 
    var albums = []; 
    users.forEach(function(entry){
      entry.albums.forEach(function(album){
        if (!album.private) {
          album.user = entry._id;
          album.owner = entry.email; 
          albums.push(album);
        };
      })
    });
    albums = albums.sort(function(a, b){
      if (req.params.num === "-1") {
        if (a.postedAt > b.postedAt)
          return 1;
        else if (a.postedAt < b.postedAt)
          return -1;
        else 
          return 0;
      } else {
        if (a.postedAt > b.postedAt)
          return -1;
        else if (a.postedAt < b.postedAt)
          return 1;
        else 
          return 0;
      }
    });
    res.render('index', { 
      title: "Sorting by Date", user: req.user, albums: albums, state: "albums"
    });
  });
});

router.get('/sortpoints/:num', function(req, res, next) {
  User.find({'_id': { $ne: req.user._id}}).populate('albums').exec(function(err, users){
    if(err) return res.status(400).send(err); 
    var albums = []; 
    users.forEach(function(entry){
      entry.albums.forEach(function(album){
        if (!album.private) {
          album.user = entry._id;
          album.owner = entry.email; 
          albums.push(album);
        };
      })
    });
    albums = albums.sort(function(a, b){
      if (req.params.num === "-1") {
        if (a.points > b.points)
          return 1;
        else if (a.points < b.points)
          return -1;
        else 
          return 0;
      } else {
        if (a.points > b.points)
          return -1;
        else if (a.points < b.points)
          return 1;
        else 
          return 0;
      }
    });
    res.render('index', { 
      title: "Sorting by Points", user: req.user, albums: albums, state: "albums"
    });
  });
});


router.get('/filter/:filter', function(req, res, next) {
  console.log("Filter!", req.params.filter);
  User.find({'_id': { $ne: req.user._id}}).populate('albums').exec(function(err, users){
    if(err) return res.status(400).send(err); 
    var albums = []; 
    var filter = req.params.filter.split('-');
    users.forEach(function(entry){
      entry.albums.forEach(function(album){
        if (!album.private) {
          album.user = entry._id;
          album.owner = entry.email; 
          albums.push(album);
        };
      })
    });
    albums = albums.filter(function(album){
      var tags = album.tags;
      var bool = false; 
      for (var i = 0; i < filter.length; i++) {
        if (tags.includes(filter[i])) bool = true; 
      };
      return bool; 
    });
    res.render('index', { 
      title: "Showing: "+filter.join(' '), user: req.user, albums: albums, state: "albums"
    });
  });
});

module.exports = router;