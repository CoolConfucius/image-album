'use strict';
var express = require('express');
var router = express.Router();

require('dotenv').config();

var aws = require('aws-sdk');
var uuid = require('node-uuid');
var s3 = new aws.S3();
var multer = require('multer');
// var upload = multer({ dest: './uploads/' });
var upload = multer({ storage: multer.memoryStorage() });

var authMiddleware = require('../config/auth');
var Album = require('../models/album');
var Image = require('../models/image');
var User = require('../models/user');
router.use(authMiddleware);
// router.post('/', upload.array('images'), function(req, res) {
//   console.log('req.files:', req.files);
//   // var filename = "maru.jpg";
//   var filename = req.files[0].originalname;
//   var buffer = req.files[0].buffer;

//     var match = filename.match(/\.\w+$/);
//     var ext = match ? match[0] : '';
//     var key = uuid.v1() + ext; 

//     var params = {
//       Bucket: process.env.AWS_BUCKET,
//       Key: filename,  // name of file on s3
//       Body: buffer      // content of file
//     };

//     s3.putObject(params, function(err, data) {  //uploads to s3
//       if (err) return console.log(err);
//       // var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + key;
//       var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + filename;

//       var image = new Image({
//         filename: filename, 
//         url: url, 
//         key: key
//       });

//       image.save(function() {
//         console.log('url:', url);
//         // res.redirect('/');
//         res.render('index', { title: 'Express', imageurl: url });
//       });
//     });
// });

// post image to an album. 
router.post('/:album', upload.array('images'), function(req, res) {
  Album.findById(req.params.album).exec(function(err, album){

    console.log('req.files:', req.files);
    var filename = req.files[0].originalname;
    var buffer = req.files[0].buffer;

    var match = filename.match(/\.\w+$/);
    var ext = match ? match[0] : '';
    var key = uuid.v1() + ext; 

    var params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,  // name of file on s3
      Body: buffer      // content of file
    };

    s3.putObject(params, function(err, data) {  //uploads to s3
      if (err) return console.log(err);
      // var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + key;
      var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + filename;

      var image = new Image({
        filename: filename, 
        url: url, 
        key: key
      });
      image.save(function(err, savedImage) {
        if (err) {res.status(400).send(err)};
        album.images.push(image._id);
        album.save(function(err, savedAlbum) {
          if(err) res.status(400).send(err);
          res.redirect('/albums/'+req.params.album+'/'+req.user._id);
          // res.status(err ? 400 : 200).send(err || savedAlbum); 
          // console.log('url:', url);
          // res.redirect('/');
          // // res.render('index', { title: 'Express', imageurl: url });
        });
      });
    });
  
  });
});


// Show an image from an album
router.get('/:owner/:album/:image', function(req, res, next){
  User.findById(req.params.owner, function(err, owner){
    if(err) res.status(400).send(err);
    Album.findById(req.params.album, function(err, album){
      if(err) res.status(400).send(err);
      Image.findById(req.params.image, function(err, image){
        if(err) res.status(400).send(err);
        res.render('showpage', { 
          state: "showimage", owner: owner, album: album, image: image, user: req.user
        });
      });
    });
  });  
});

// Remove an image from an album
router.delete('/:album/:image', function(req, res, next){
  Album.findById(req.params.album, function(err, album){
    if(err) res.status(400).send(err);
    Image.findById(req.params.image, function(err, image){
      if(err) res.status(400).send(err);
      var index = album.images.indexOf(image._id);
      if (index === -1) { console.log("Not found!"); return; };
      album.images.splice(index, 1);
      album.save(function(err, savedAlbum){
        image.remove();
        res.status(err ? 400 : 200).send(err || savedAlbum);
      });
    });
  });
});



// Add an image to favorites: 
// Album gets points for images favorited. 
// router.post('/fave/:album/:image', function(req, res, next){
//   User.findById(req.user._id, function(err, user){
//     Album.findById(req.params.album, function(err, album){
//       if(err) res.status(400).send(err);
//       Image.findById(req.params.image, function(err, image){
//         if(err) res.status(400).send(err);

//         album.points++; 
//         album.save(function(err, savedAlbum){

//           user.faveimages.push(image._id);
//           user.save(function(err, savedUser){
//             res.status(err ? 400 : 200).send(err || savedAlbum);
//           });
//         });
//       });
//     });    
//   });
// });


// router.delete('/unfave/:image', function(req, res, next){
//   User.findById(req.user._id, function(err, user){
//     // Album.findById(req.params.album, function(err, album){
//     //   if(err) res.status(400).send(err);
//       Image.findById(req.params.image, function(err, image){
//         if(err) res.status(400).send(err);

//         // album.points++; 
//         // album.save(function(err, savedAlbum){
//           var index = user.faveimages.indexOf(image._id);
//           if (index === -1) { console.log("Not found!"); return; };
//           user.faveimages.splice(index, 1);
          
//           user.save(function(err, savedUser){
//             res.status(err ? 400 : 200).send(err || savedUser);
//           });
//         });
//     //   });
//     // });    
//   });
// });



module.exports = router;