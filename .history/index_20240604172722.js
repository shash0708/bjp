const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const EventSchema = require('./models/event');
const Student = require('./models/Student');
const calculateAndCheckDistance = require('./utils/distance'); // Adjust the path as per your file structure

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
      res.status(200). res.json(savedNote);
        json({ message: 'Update successful' });

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


 
app.post('/generate-link', async (req, res) => {
    const { eventName } = req.body; // Expecting event ID to be sent in the request
    try {
      const event = await EventSchema.findOne({ eventName: eventName });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const baseUrl = 'https://attendence-49cr.vercel.app/';
        const eventNameSlug = encodeURIComponent(event.eventName.replace(/\s+/g, '-').toLowerCase());
        const fullUrl = `${baseUrl}${eventNameSlug}/student-form`;

        const newLink = new Link({
            eventNameSlug,
            url: fullUrl,
        });
        await newLink.save();

        res.status(201).json({ link: fullUrl });
    } catch (error) {
        console.error('Error generating link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/student-form', async (req, res) => {
    try {
      // Extract event data from the request body
      const { eventName,RegdNo,contactNo,year,Branch,email,userLocation} = req.body;
      const eventN = await EventSchema.findOne({ eventName });
      const Regd = await EventSchema.findOne({ RegdNo });
  
  
     if (Regd) {
        return res.status(404).json({ error: ' User Already exist' });
      }
  
      if (!eventN) {
        return res.status(404).json({ error: 'Event not found' });
      }
      console.log('Received form data:', req.body);
  
      try {
        const isWithinRadius = await calculateAndCheckDistance(eventN.adminLocation, userLocation, eventN.maxRadius);
      } catch (error) {
        if (error.message === 'Distance exceeds maximum radius') {
          return res.status(400).json({ error: 'User location is outside the allowed radius' });
        }
        throw error;
      }
      // Log or use the distance if needed
    //    console.log(`Calculated distance: ${isWithinRadius} meters`);    // Create a new event object using the extracted data
      const student = new Student({
        eventName,RegdNo,contactNo,Branch,year,email,userLocation  })
      console.log("sdfg")
  
    
      // Save the event to the database
  
      
      const savedaStudent = await student.save();
      res.json(savedaStudent);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
    
  app.get('/fetchStudentData', async (req, res) => {
    try {
      const eventName = req.query.eventName; // Extract eventName from query parameters
      console.log(eventName);
  
      // Find events with matching eventName
      const events = await Student.find({ eventName: eventName });
  
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