const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const EventSchema = require('./models/event');
const Student = require('./models/Student');
const calculateAndCheckDistance = require('./utils/distance'); // Adjust the path as per your file structure

dotenv.config();

app.use(express.json());

app.use(cors({
  origin: "https://attendence-49cr.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

const uri = process.env.MONGO_URI; // Use environment variable for MongoDB URI

mongoose.connect(uri);
const con = mongoose.connection;
con.once("open", () => {
  console.log("MongoDB connected");
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.post('/update', async (req, res) => {
  try {
    const { eventName, contactNo, strength, year, organization, department, maxRadius, adminLocation } = req.body;
    const lowercaseEventName = eventName.toLowerCase();

    const event = new EventSchema({
      eventName: lowercaseEventName,
      contactNo,
      strength,
      year,
      organization,
      department,
      maxRadius,
      adminLocation,
    });

    const savedNote = await event.save();
    res.json()
    res.status(200).json({ message: 'Update successful', savedNote });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/fetchEventDetails', async (req, res) => {
  try {
    const eventName = req.query.eventName;
    const events = await EventSchema.find({ eventName });

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found with the provided eventName' });
    }

    res.json(events);
  } catch (error) {
    console.error("Error in fetching the events:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/generate-link', async (req, res) => {
  try {
    const { eventName } = req.body;
    const event = await EventSchema.findOne({ eventName });

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
    const { eventName, RegdNo, contactNo, year, Branch, email, userLocation } = req.body;
    const eventN = await EventSchema.findOne({ eventName });
    const Regd = await Student.findOne({ RegdNo });

    if (Regd) {
      return res.status(404).json({ error: 'User already exists' });
    }

    if (!eventN) {
      return res.status(404).json({ error: 'Event not found' });
    }

    try {
      const isWithinRadius = await calculateAndCheckDistance(eventN.adminLocation, userLocation, eventN.maxRadius);
      if (!isWithinRadius) {
        return res.status(400).json({ error: 'User location is outside the allowed radius' });
      }
    } catch (error) {
      throw error;
    }

    const student = new Student({
      eventName, RegdNo, contactNo, Branch, year, email, userLocation,
    });

    const savedaStudent = await student.save();
    res.json(savedaStudent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/fetchStudentData', async (req, res) => {
  try {
    const eventName = req.query.eventName;
    const students = await Student.find({ eventName });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found with the provided eventName' });
    }

    res.json(students);
  } catch (error) {
    console.error("Error in fetching the students:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}.`);
});

// Export the Express API
module.exports = app;