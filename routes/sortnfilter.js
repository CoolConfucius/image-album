'use strict'; 
var express = require('express');
var router = express.Router();
var async = require('async'); 
var authMiddleware = require('../config/auth');
var Album = require('../models/album');
var Image = require('../models/image');
var User = require('../models/user');
router.use(authMiddleware);


// router.get('/', function(req, res, next) {  
//   User
//   .find({
//     '_id': { $ne: req.user._id}
//   })
//   .populate('albums')
//   .exec(function(err, users){
//     console.log(users, "USERS");
//     if(err) return res.status(400).send(err); 
//     var albums = []; 
//     users.forEach(function(entry){
//       entry.albums.forEach(function(album){
//         if (!album.private) {
//           album.user = entry._id; 
//           albums.push(album);
//         };
//       });
//     });
//     res.render('index', { 
//       title: "Public Albums", user: req.user, albums: albums, state: "albums"
//     });
//   });
// });



// Sorting: 
router.get('/sorttitle/:num', function(req, res, next) {
  User.find({'_id': { $ne: req.user._id}}).populate('albums').exec(function(err, users){
    console.log(users, "USERS");
    if(err) return res.status(400).send(err); 
    var albums = []; 
    users.forEach(function(entry){
      entry.albums.forEach(function(album){
        if (!album.private) {
          album.user = entry._id; 
          albums.push(album);
        };
      })
    });
    albums = albums.sort(
      function(a, b){
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
      title: "Public Albums", user: req.user, albums: albums, state: "albums"
    });
  });

  // Album.find({

  // }, function(err, products) {
  //   if (err) {
  //     return res.status(400).send(err);
  //   };
  //   res.render('index', { 
  //     title: 'Album Wish List', 
  //     products: products, 
  //     subTitle: "Sorting by Name"});
  // }).sort( { name: parseInt(req.params.num) } );
});

// router.get('/sortpoints/:num', function(req, res, next) {
//   Album.find({}, function(err, products) {
//     if (err) {
//       return res.status(400).send(err);
//     };
//     res.render('index', { 
//       title: 'Album Wish List', 
//       products: products, 
//       subTitle: "Sorting by Price"});
//   }).sort( { price: parseInt(req.params.num) } );
// });

// router.get('/sortdate/:num', function(req, res, next) {
//   Album.find({}, function(err, products) {
//     if (err) {
//       return res.status(400).send(err);
//     };
//     res.render('index', { 
//       title: 'Album Wish List', 
//       products: products, 
//       subTitle: "Sorting by Date Added"});
//   }).sort( { addedAt: parseInt(req.params.num) } );
// });

module.exports = router;