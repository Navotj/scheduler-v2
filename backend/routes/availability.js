const express = require('express');
const router = express.Router();
const WeekAvailability = require('./WeekAvailability');

// API to save user availability
router.post('/save', async (req, res) => {
    const { username, week, availability } = req.body;
    console.log('Received save request:', req.body);
    try {
        let weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            // Update availability for the specific week
            weekAvailability.availability = [{ times: availability }];
        } else {
            // Create new week availability entry
            weekAvailability = new WeekAvailability({
                username,
                week,
                availability: [{ times: availability }]
            });
        }
        await weekAvailability.save();
        console.log('User week availability saved:', weekAvailability);
        res.send('User week availability saved');
    } catch (error) {
        console.error('Error saving user availability:', error);
        res.status(500).send('Error saving user availability');
    }
});

// API to get user availability for a specific week
router.get('/availability/:username/:week', async (req, res) => {
    const { username, week } = req.params;
    try {
        const weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            res.json({
                username: weekAvailability.username,
                week: weekAvailability.week,
                availability: weekAvailability.availability,
                __v: weekAvailability.__v
            });
        } else {
            res.json({
                username,
                week,
                availability: [],
                __v: 0
            });
        }
    } catch (error) {
        console.error('Error fetching user availability:', error);
        res.status(500).send('Error fetching user availability');
    }
});


module.exports = router;
