'use strict';
var express = require('express');
var router = express.Router();
var async = require('async');
var authMiddleware = require('../config/auth');
var Album = require('../models/album');
var Image = require('../models/image');
var User = require('../models/user');
router.use(authMiddleware);

// list of albums, featuring the first photo as thumbnail, may be able to set an index later. 
router.get('/mine', function(req, res, next) {
  User
  .findById(req.user._id)
  .populate('albums')
  .exec(function(err, user) {
    if (err) { res.status(400).send(err); return; };
    res.render('index', { 
      title: 'Your Albums', state: 'myalbums', user: req.user, albums: user.albums
    }); 
  })
});

// albums, not yours, and are public. 
router.get('/', function(req, res, next) {  
  User
  .find({
    '_id': { $ne: req.user._id}
  })
  .populate('albums')
  .exec(function(err, users){
    console.log(users, "USERS");
    if(err) return res.status(400).send(err); 
    var albums = []; 
    users.forEach(function(entry){
      entry.albums.forEach(function(album){
        if (!album.private) {
          album.user = entry._id; 
          album.owner = entry.email; 
          albums.push(album);
        };
      });
    });
    res.render('index', { 
      title: "Public Albums", user: req.user, albums: albums, state: "albums"
    });
  });
});

// Post a new album. Albums start out empty. Images are added later. 
router.post('/', function(req, res) {
  User.findById(req.user._id, function(err, user) {
    req.body.user = req.user._id; 
    var album = new Album(req.body); 
    album.save(function(err, savedAlbum){
      
      if (err) {res.status(400).send(err)};
      user.albums.push(album._id);
      user.save(function(err, savedUser) {
        res.status(err ? 400 : 200).send(err || savedUser); 
      });
    });
  });
});


// showpage:
router.get('/:album/:owner', function(req, res, next){
  Album.findById(req.params.album).populate('images').exec( function(err, album){
    if(err) res.status(400).send(err); 
    User.findById(req.params.owner, function(err, owner){
      res.render('showpage', {
        state: "showalbum",
        user: req.user,
        album: album, owner:owner,
        albumid: req.params.album,
        ownerid: req.params.owner
      });
    });
  }); 
});

// Remove an album
router.delete('/:album', function(req, res, next){
  User.findById(req.user._id, function(err, user){
    if(err) res.status(400).send(err);

    Album.findById(req.params.album).populate('images').exec(
      function(err, album){
      if(err) res.status(400).send(err);

      var index = user.albums.indexOf(album._id);
      if (index === -1) { console.log("Not found!"); return; };
      
      async.each(album.images, function(image, callback) {
        image.remove();
        console.log(image);
        callback();
      });
      user.albums.splice(index, 1);
      
      user.save(function(err, savedUser){
        album.remove();
        res.status(err ? 400 : 200).send(err || savedUser);
        
      });
    });
  });
});


// Toggle Album's Privacy 
router.put('/toggle/:album', function(req, res, next){
  Album.findById(req.params.album, function(err, album){
    if(err) res.status(400).send(err);
    album.private = !album.private; 
    album.save(function(err, savedAlbum){
      res.status(err ? 400 : 200).send(err || savedAlbum);
    });
  });
});


module.exports = router;
