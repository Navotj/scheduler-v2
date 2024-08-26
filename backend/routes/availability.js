const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// Save availability data
router.post('/availability', async (req, res) => {
    const { username, times } = req.body;

    try {
        let availability = await Availability.findOne({ username });

        if (availability) {
            // Update existing availability
            availability.times = times;
        } else {
            // Create new availability
            availability = new Availability({ username, times });
        }

        await availability.save();
        res.status(200).json({ message: 'Availability saved successfully' });
    } catch (err) {
        console.error('Error saving availability:', err);
        res.status(500).json({ error: 'Failed to save availability' });
    }
});

// Fetch availability data
router.get('/availability', async (req, res) => {
    const { username } = req.query;

    try {
        const availability = await Availability.findOne({ username });

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

module.exports = router;
