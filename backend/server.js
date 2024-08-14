const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection with proper error handling
mongoose.connect('mongodb://localhost:27017/scheduler', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('Mongoose reconnected to MongoDB');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});

// Define your schemas and routes below
const availabilitySchema = new mongoose.Schema({
    times: [{ start: Number, end: Number }]
});

const weekAvailabilitySchema = new mongoose.Schema({
    username: String,
    week: Number,
    availability: [availabilitySchema]
});

const WeekAvailability = mongoose.model('WeekAvailability', weekAvailabilitySchema);

app.post('/save', async (req, res) => {
    const { username, week, availability } = req.body;
    try {
        let weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            // Clear existing availability before saving new data
            weekAvailability.availability = [{ times: availability }];
        } else {
            weekAvailability = new WeekAvailability({
                username,
                week,
                availability: [{ times: availability }]
            });
        }
        await weekAvailability.save();
        res.send('User week availability saved');
    } catch (error) {
        console.error('Error saving user availability:', error);
        res.status(500).send('Error saving user availability');
    }
});

app.get('/availability/:username/:week', async (req, res) => {
    const { username, week } = req.params;
    try {
        const weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            res.json(weekAvailability.availability);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching user availability:', error);
        res.status(500).send('Error fetching user availability');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
