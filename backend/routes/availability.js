const express = require('express');
const router = express.Router();
const WeekAvailability = require('../models/WeekAvailability');

// API to save user availability
router.post('/save', async (req, res) => {
    const { username, week, availability } = req.body;
    console.log('Received save request:', req.body);

    try {
        let weekAvailability = await WeekAvailability.findOne({ username, week });
        console.log('Found week availability:', weekAvailability);

        if (weekAvailability) {
            weekAvailability.availability = [{ times: availability }];
            console.log('Updating existing week availability');
        } else {
            weekAvailability = new WeekAvailability({
                username,
                week,
                availability: [{ times: availability }]
            });
            console.log('Creating new week availability');
        }

        await weekAvailability.save();
        console.log('Availability successfully saved');
        res.send('User week availability saved');
    } catch (error) {
        console.error('Error saving user availability:', error);
        res.status(500).send('Error saving user availability');
    }
});

router.get('/availability/:username/:week', async (req, res) => {
    const { username, week } = req.params;
    console.log(`Fetching availability for user: ${username}, week: ${week}`);

    try {
        const weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            console.log('Found availability:', weekAvailability);
            res.json({
                username: weekAvailability.username,
                week: weekAvailability.week,
                availability: weekAvailability.availability.length > 0 ? weekAvailability.availability[0].times : [],
                __v: weekAvailability.__v
            });
        } else {
            console.log('No availability found for the user and week:', { username, week });
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
