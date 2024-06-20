const mongoose = require('mongoose');
const crypto = require('crypto');


const linkSchema = new mongoose.Schema({
eventNameSlug: String,
    url: String,
  });
  
  const Link = mongoose.model('Link', linkSchema);


  module.exports = Link;