
const express = require('express');
const WeekAvailability = require('../models/WeekAvailability');

const router = express.Router();

// API to save user availability
router.post('/save', async (req, res) => {
    const { username, week, availability } = req.body;
    console.log('Received save request:', req.body);
    try {
        let weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            // Update availability for the specific week
            weekAvailability.availability = availability;
        } else {
            // Create new week availability entry
            weekAvailability = new WeekAvailability({ username, week, availability });
        }
        await weekAvailability.save();
        console.log('User week availability saved:', weekAvailability);
        res.send('User week availability saved');
    } catch (error) {
        console.error('Error saving user availability:', error);
        res.status(500).send('Error saving user availability');
    }
});

// API to get user availability
router.get('/availability/:username/:week', async (req, res) => {
    const { username, week } = req.params;
    console.log('Received get availability request for username:', username, 'week:', week);
    try {
        const weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            console.log('User week availability found:', weekAvailability.availability);
            res.json(weekAvailability.availability);
        } else {
            console.log('Week availability not found');
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching user availability:', error);
        res.status(500).send('Error fetching user availability');
    }
});

module.exports = router;
