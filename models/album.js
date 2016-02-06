'use strict';

var mongoose = require('mongoose');
var User = require('../models/user');
var Image = require('../models/image');
var moment = require('moment');

var Album; 

var albumSchema = new mongoose.Schema({
  title: {type: String },
  description: { type: String },
  owner: { type: String },
  tags: { type: String },
  points: { type: Number, default: 0 },
  coverurl: { type: String },
  private: { type: Boolean, default: false },
  postedAt: { type: Date, default: Date.now }, 
  formattedDate: { type: String, default: moment().format('MM/DD/YYYY, h:mm a') }, 
  shortDate: { type: String, default: moment().format('MM/DD/YYYY') }, 
  // comments: [{ 
  //   name: String, 
  //   body: String, 
  //   date: Date 
  // }], 
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }]
}); 

Album = mongoose.model('Album', albumSchema);

module.exports = Album;
