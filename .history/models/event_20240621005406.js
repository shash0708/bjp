const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  strength: {
    type: String,
    required: true,
  },
  year: {
    type: [String], // Change to array of strings
    required: true
  },
  organization: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
 
  },
  maxRadius: {
    type: Number,
    required: true
  },
  adminLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  createdAt: {
    //     type: Date,
    //     default: Date.now,
    //     expires: 172800// TTL index to expire document 60 seconds (1 minute) after creation
    //   }

});

const Event= mongoose.model('Event', EventSchema);
module.exports = Event
 