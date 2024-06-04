const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config();

app.use(express.json());

app.use(cors(
  {
    origin : "https://attendence-49cr.vercel.app",
    methods : ["GET","POST","PUT","DELETE"],
    credentials : true
  }
  
//origin means from any kind of domain if we want to access the router we need this

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

const uri = "mongodb+srv://shashankpeddinti07:NO13p1MWQqgcsIWc@cluster0.ssab6nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


mongoose.connect(uri);
const con = mongoose.connection;
con.once("open", () => {
  console.log("Mongo DB connected");
});


app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;