const mongoose = require('mongoose');
const crypto = require('crypto');


const linkSchema = new mongoose.Schema({
eventNameSlug: String,
    url: String,
    // createdAt: {
      //     type: Date,
      //     default: Date.now,
      //     expires: 172800// TTL index to expire document 60 seconds (1 minute) after creation
      //   }
      createdAt: { type: Date, expires: '48h', default: Date.now }, // TTL index for 48 hours

  });
  
  const Link = mongoose.model('Link', linkSchema);


  module.exports = Link;