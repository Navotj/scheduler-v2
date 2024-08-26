const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// Route to save availability data
router.post('/save', async (req, res) => {
    const { username, times } = req.body;
    console.log('Received save request:', req.body);

    try {
        let availability = await Availability.findOne({ username });

        if (availability) {
            // Update existing availability
            availability.times = times.map(({ startDate, endDate }) => ({
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            }));
            console.log('Updating existing availability');
        } else {
            // Create new availability
            availability = new Availability({
                username,
                times: times.map(({ startDate, endDate }) => ({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                })),
            });
            console.log('Creating new availability');
        }

        await availability.save();
        console.log('Availability successfully saved');
        res.send('User availability saved');
    } catch (error) {
        console.error('Error saving user availability:', error);
        res.status(500).send('Error saving user availability');
    }
});

// Route to fetch availability data
router.get('/availability/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const availability = await Availability.findOne({ username });
        if (availability) {
            res.json({
                username: availability.username,
                times: availability.times.map(({ startDate, endDate }) => ({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                })),
            });
        } else {
            res.json({
                username,
                times: []
            });
        }
    } catch (error) {
        console.error('Error fetching user availability:', error);
        res.status(500).send('Error fetching user availability');
    }
});

module.exports = router;
