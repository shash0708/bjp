


const xlsxSchema = new mongoose.Schema({
    regdno: String, // Assuming regdno is the only required field
    // Add other optional fields as needed
  });
  


  
const Excel= mongoose.model('Excel', xlsxSchema);
module.exports = Event
 