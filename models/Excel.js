const mongoose = require('mongoose');

const xlsxSchema = new mongoose.Schema({
    regdno: String, // Assuming regdno is the only required field
    // Add other optional fields as needed
    createdAt: { type: Date, expires: '48h', default: Date.now }, // TTL index for 48 hours

  });
  


  
const Excel= mongoose.model('Excel', xlsxSchema);
module.exports = Excel
 