'use strict';

var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var JWT_SECRET = process.env.JWT_SECRET;

var User;
var Album = require('../models/album');

var userSchema = new mongoose.Schema({
  uid: { type: String },
  email: { type: String }, 
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  favealbums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  faveimages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], 
  profile: {
    name: String,
    phone: Number, 
    birthday: Date,
    aboutme: String
  }
  
});

// instance method
userSchema.methods.generateToken = function() {
  var payload = {
    uid: this.uid,
    _id: this._id,
    email: this.email
  };
  var token = jwt.encode(payload, JWT_SECRET);

  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
