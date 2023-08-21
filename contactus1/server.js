const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const DB_URI = "mongodb+srv://purnimakabadwal3:ejtk9aHuqEpIADlv@purnima.2ydc711.mongodb.net/?retryWrites=true&w=majority";

// MongoDB Connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', () => console.error('Error connecting to the database'));
db.once('open', () => {
  console.log('Connected to the database');
});

// MongoDB Schema
const contactSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  mobile: String,
  msg: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// API Endpoint for Form Submission
app.post('/submit', async (req, res) => {
  try {
    const { fname, lname, email, mobile, msg } = req.body;
    const newContact = new Contact({
      fname,
      lname,
      email,
      mobile,
      msg,
    });
    await newContact.save();
    res.status(201).redirect('/success.html');
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
