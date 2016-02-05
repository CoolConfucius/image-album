'use strict';

var mongoose = require('mongoose');
var User = require('../models/user');
var Image = require('../models/image');

var Image; 

var imageSchema = new mongoose.Schema({
  filename: { type: String },
  url: { type: String }, 
  key: { type: String }
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

Image = mongoose.model('Image', imageSchema);

module.exports = Image;
