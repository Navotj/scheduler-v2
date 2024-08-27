const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const DefaultAvailability = require('../models/DefaultAvailability');

// Route for saving availability
router.post('/', async (req, res) => {
    const { username, times } = req.body;

    try {
        let availability = await Availability.findOne({ username });

        if (availability) {
            availability.times = times;
        } else {
            availability = new Availability({ username, times });
        }

        await availability.save();
        res.status(200).json({ message: 'Availability saved successfully' });
    } catch (err) {
        console.error('Error saving availability:', err);
        res.status(500).json({ error: 'Failed to save availability' });
    }
});

// Route for fetching availability
router.get('/', async (req, res) => {
    console.log('GET /availability called with:', req.query.username);
    const { username } = req.query;

    try {
        const availability = await Availability.findOne({ username: username.trim() });
        console.log('Query Result:', availability);
        
        if (availability) {
            res.json(availability);
        } else {
            res.status(404).json({ error: 'No availability found' });
        }
    } catch (err) {
        console.error('Error fetching availability:', err);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

// Route for saving default availability
router.post('/default', async (req, res) => {
    const { username, defaultWeek } = req.body;

    try {
        let defaultAvailability = await DefaultAvailability.findOne({ username });

        if (defaultAvailability) {
            defaultAvailability.defaultWeek = defaultWeek;
        } else {
            defaultAvailability = new DefaultAvailability({ username, defaultWeek });
        }

        await defaultAvailability.save();
        res.status(200).json({ message: 'Default availability saved successfully' });
    } catch (err) {
        console.error('Error saving default availability:', err);
        res.status(500).json({ error: 'Failed to save default availability' });
    }
});

// Route for fetching default availability
router.get('/default', async (req, res) => {
    const { username } = req.query;

    try {
        const defaultAvailability = await DefaultAvailability.findOne({ username: username.trim() });
        
        if (defaultAvailability) {
            res.json(defaultAvailability);
        } else {
            res.status(404).json({ error: 'No default availability found' });
        }
    } catch (err) {
        console.error('Error fetching default availability:', err);
        res.status(500).json({ error: 'Failed to fetch default availability' });
    }
});

module.exports = router;
