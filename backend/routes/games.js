const express = require('express');
const router = express.Router();
const WeekAvailability = require('../models/WeekAvailability');

router.post('/save', async (req, res) => {
    const { username, week, times } = req.body;
    console.log('Received save request:', req.body);

    try {
        let weekAvailability = await WeekAvailability.findOne({ username, week });

        if (weekAvailability) {
            weekAvailability.availability = times.map(({ starttime, endtime }) => ({
                start: new Date(starttime),
                end: new Date(endtime)
            }));
            console.log('Updating existing week availability');
        } else {
            weekAvailability = new WeekAvailability({
                username,
                week,
                availability: times.map(({ starttime, endtime }) => ({
                    start: new Date(starttime),
                    end: new Date(endtime)
                }))
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

    try {
        const weekAvailability = await WeekAvailability.findOne({ username, week });
        if (weekAvailability) {
            res.json({
                username: weekAvailability.username,
                week: weekAvailability.week,
                availability: weekAvailability.availability.map(({ start, end }) => ({
                    starttime: start.toISOString(),
                    endtime: end.toISOString()
                }))
            });
        } else {
            res.json({
                username,
                week,
                availability: []
            });
        }
    } catch (error) {
        console.error('Error fetching user availability:', error);
        res.status(500).send('Error fetching user availability');
    }
});

module.exports = router;
