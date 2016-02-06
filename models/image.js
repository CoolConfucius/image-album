'use strict';

var aws = require('aws-sdk');
var async = require('async'); 
var uuid = require('node-uuid');
var s3 = new aws.S3();
var multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() });
var mongoose = require('mongoose');
var User = require('../models/user');
var Image = require('../models/image');

var Image; 

var imageSchema = new mongoose.Schema({
  filename: { type: String },
  url: { type: String }, 
  key: { type: String },
  album: { type: String }
  // ,
  // description: { type: String },
  // contributors: [ { type: String } ],
  // points: { type: Number },
  // coverurl: { type: String },
  // private: { type: Boolean, default: false },
  // postedAt: { type: Date, default: Date.now() }, 
  // comments: [{ 
  //   name: String, 
  //   body: String, 
  //   date: Date 
  // }]
}); 

imageSchema.statics.upload = function(files, done) {
  async.map(files, uploadFile, done); 
};

function uploadFile(file, cb) {
  var filename = file.originalname.replace(/ /g,''); 
  var data = file.buffer; 

  var match = filename.match(/\.\w+$/);
  var ext = match ? match[0] : '';
  var key = uuid.v1() + ext; 

  var params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key, 
    Body: data
  };

  s3.putObject(params, function(err) {
    if(err) return cb(err);
    var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + key;
    // var url = process.env.AWS_URL + process.env.AWS_BUCKET + '/' + filename;
    var image = new Image({
      filename: filename, 
      url: url,
      key: key
    });
    image.save(function(err, savedImage) {
      if (err) return cb(err);
      cb(null, savedImage);
    })
  });
}

Image = mongoose.model('Image', imageSchema);

module.exports = Image;
