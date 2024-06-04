const mongoose  = require('mongoose');

const StudentSchema  =   new mongoose.Schema({
    eventName :{
        type:String,
        required:true
    },
    RegdNo :{
        type:String,
        required:true
    },
    contactNo:{
        type:String,
        unique:true,
        required: true
    },
    Branch:{
        type:String,
        required: true
    },
    email:{
        type: String ,
        required:true
    },
    year:{
         type:Number,
         required:true
    },
    userLocation: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        }
      }
    
})

const student = new mongoose.model('StudentData',StudentSchema);
module.exports=student;