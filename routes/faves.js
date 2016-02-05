'use strict';
var express = require('express');
var router = express.Router();

// require('dotenv').config();

// var aws = require('aws-sdk');
// var uuid = require('node-uuid');
// var s3 = new aws.S3();
// var multer = require('multer');
// var upload = multer({ dest: './uploads/' });
// var upload = multer({ storage: multer.memoryStorage() });

var authMiddleware = require('../config/auth');
var Album = require('../models/album');
var Image = require('../models/image');
var User = require('../models/user');
router.use(authMiddleware);


// Add an image to favorites: 
// Album gets points for images favorited. 
router.post('/:album/:image', function(req, res, next){
  User.findById(req.user._id, function(err, user){
    Album.findById(req.params.album, function(err, album){
      if(err) res.status(400).send(err);
      Image.findById(req.params.image, function(err, image){
        if(err) res.status(400).send(err);

        album.points++; 
        album.save(function(err, savedAlbum){

          user.faveimages.push(image._id);
          user.save(function(err, savedUser){
            res.status(err ? 400 : 200).send(err || savedAlbum);
          });
        });
      });
    });    
  });
});


router.delete('/:image', function(req, res, next){
  User.findById(req.user._id, function(err, user){
    // Album.findById(req.params.album, function(err, album){
    //   if(err) res.status(400).send(err);
      Image.findById(req.params.image, function(err, image){
        if(err) res.status(400).send(err);

        // album.points++; 
        // album.save(function(err, savedAlbum){
          var index = user.faveimages.indexOf(image._id);
          if (index === -1) { console.log("Not found!"); return; };
          user.faveimages.splice(index, 1);
          
          user.save(function(err, savedUser){
            res.status(err ? 400 : 200).send(err || savedUser);
          });
        });
    //   });
    // });    
  });
});



module.exports = router;