const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const EventSchema = require('./models/event');
const Link = require('./models/Link')
const Student = require('./models/Student');
dotenv.config();

app.use(express.json());

app.use(cors(
  {
    origin : "https://attendence-49cr.vercel.app",
    methods : ["GET","POST","PUT","DELETE"],
    credentials : true
  }
));
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



app.post('/update', async (req, res) => {
    try {
        res.send('Update endpoint reached');

      // Extract event data from the request body
      const {eventName,contactNo,strength,year,organization,department,maxRadius,adminLocation} = req.body;
      // Create a new event object using the extracted data

      const lowercaseEventName = eventName.toLowerCase();


      const event = new EventSchema({
        eventName: lowercaseEventName // Use lowercaseEventName here
        ,contactNo,strength,year,organization,department,maxRadius,adminLocation
      })
      // Save the event to the database
      const savedNote = await event.save();
      res.json(savedNote);
        res.status(200).json({ message: 'Update successful' });

    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
    

 app.get('/fetchEventDetails', async (req, res) => {
  try {
    const eventName = req.query.eventName; // Extract eventName from query parameters
    console.log(eventName);

    // Find events with matching eventName
    const events = await EventSchema.find({ eventName: eventName });

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found with the provided eventName' });
    }

    res.json(events);
  } catch (error) {
    console.log("Error in Fetching the events:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;