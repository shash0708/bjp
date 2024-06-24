const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const User = require('./models/User');
const EventSchema = require('./models/event');
const Student = require('./models/Student');
const Link = require('./models/Link');
const { getDistance, calculateAndCheckDistance } = require('./utils/dis'); // Import distance utilities

global._basedir = __dirname;

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://attendence-49cr.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://shashankpeddinti07:NO13p1MWQqgcsIWc@cluster0.ssab6nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Increase timeout for initial connection
});
const con = mongoose.connection;
con.once("open", () => {
  console.log("Mongo DB connected");
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, _basedir + '/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const userController = require('./controllers/userController');

app.post('/upload', upload.single('file'), userController.importUser
);

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
      adminLocation
    });
    
    const savedNote = await event.save();
    console.log(savedNote);
    res.json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/fetchEventDetails', async (req, res) => {
  try {
    const eventName = req.query.eventName;
    console.log(eventName);

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
  const { eventName } = req.body;
  try {
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
    console.log(fullUrl);
    res.status(201).json({ link: fullUrl });
  } catch (error) {
    console.error('Error generating link:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/student-form', async (req, res) => {
  try {
    const { eventName, RegdNo, contactNo, year, Branch, email, userLocation } = req.body;
    console.log(userLocation);
    const k =RegdNo;
console.log(k);
    const eventN = await EventSchema.findOne({ eventName });
    if (!eventN) {
      return res.status(404).json({ error: 'Event not found' });
    }


    const Regdno = await User.findOne({ k });
    console.error("User not found with RegdNo: (out)", Regdno);
    if (!Regdno) {
      console.error("User not found with RegdNo:", Regdno);
      return res.status(404).json({ error: 'Error! Please Contact Co-ordinator' });
    }

    const Regd = await Student.findOne({ RegdNo });
    if (Regd) {
      return res.status(400).json({ error: 'User Already exists' });
    }

    try {
      await calculateAndCheckDistance(eventN.adminLocation, userLocation, eventN.maxRadius);
      console.log(eventN.maxRadius);
    } catch (error) {
      if (error.message === 'Distance exceeds maximum radius') {
        return res.status(400).json({ error: 'User location is outside the allowed radius' });
      }
      throw error;
    }

    const student = new Student({
      eventName,
      RegdNo,
      contactNo,
      Branch,
      year,
      email,
      userLocation
    });

    const savedStudent = await student.save();
    res.json(savedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/fetchStudentData', async (req, res) => {
  try {
    const eventName = req.query.eventName;
    console.log(eventName);

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

module.exports = app;
