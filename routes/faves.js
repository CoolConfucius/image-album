'use strict';
var express = require('express');
var router = express.Router();
var async = require('async');
var authMiddleware = require('../config/auth');
var Album = require('../models/album');
var Image = require('../models/image');
var User = require('../models/user');
router.use(authMiddleware);



// go to favorite images
router.get('/', function(req, res, next) {
  console.log("User: ", req.user);
  User.findById(req.user._id).populate('faveimages')
  .exec(function(err, user){
    
    res.render('showpage', { 
      user: user, state: "faveimages",
    });
  });
});

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
    Album.findOne({ images: { $in: [req.params.image] } }, function(err, album){
      if(err) res.status(400).send(err);
      Image.findById(req.params.image, function(err, image){
        if(err) res.status(400).send(err);

        album.points--; 
        album.save(function(err, savedAlbum){
          var index = user.faveimages.indexOf(image._id);
          if (index === -1) { console.log("Not found!"); return; };
          user.faveimages.splice(index, 1);
          
          user.save(function(err, savedUser){
            res.status(err ? 400 : 200).send(err || savedUser);
          });
        });
      });
    });    
  });
});

router.get('/show/:image', function(req, res, next) {
  var albumid, ownerid; 
  async.series([
    function(callback){
      Album.findOne({
        images: { $in: [req.params.image] }
      }).exec(function(err, album){
        callback(null, album._id)
      }); 
    }
  ], function(err, results){
    User.findOne({
      albums: { $in: [results[0]] }
    }).exec(function(err, owner){
      console.log("OWNER,", owner);
      console.log("OWNERID,", owner._id);
      console.log("RESULTS", results);
      var ownerid = '/' + (owner._id);
      var album = '/' + results[0];
      res.redirect('/images'+ownerid+album+'/'+req.params.image);
      
    });
  });
});


module.exports = router;