var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    RegdNo:{
        type:String,
    },
    number:{
        type:Number
    },
    createdAt: { type: Date, expires: '48h', default: Date.now }, // TTL index for 48 hours

});


module.exports = mongoose.model('User',userSchema);