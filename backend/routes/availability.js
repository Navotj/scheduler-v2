const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const WeekTemplate = require('../models/WeekTemplates');

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

router.post('/templates', async (req, res) => {
    const { username, templateName, weekTemplate } = req.body;

    console.log('Received username:', username);
    console.log('Received templateName:', templateName);
    console.log('Received weekTemplate:', weekTemplate);

    try {
        // Try to find the existing template by username and templateName
        const existingTemplate = await WeekTemplate.findOne({ username: username.trim(), templateName });

        if (existingTemplate) {
            console.log('Existing template found:', existingTemplate);
            // If the template exists, update its weekTemplate data
            existingTemplate.weekTemplate = weekTemplate;
            await existingTemplate.save();
            res.status(200).json({ message: 'Template updated successfully', template: existingTemplate });
        } else {
            console.log('No existing template found, creating a new one');
            // If no existing template, create a new one
            const newTemplate = new WeekTemplate({ username, templateName, weekTemplate });
            await newTemplate.save();
            res.status(200).json({ message: 'Template created successfully', template: newTemplate });
        }
    } catch (err) {
        console.error('Error saving/updating template:', err);
        res.status(500).json({ error: 'Failed to save or update template' });
    }
});

// Route for fetching templates
router.get('/templates', async (req, res) => {
    const { username } = req.query;

    try {
        const templates = await WeekTemplate.find({ username: username.trim() });
        res.json({ templates });
    } catch (err) {
        console.error('Error fetching templates:', err);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});


router.delete('/templates', async (req, res) => {
    const { username, templateName } = req.body;

    try {
        const result = await WeekTemplate.deleteOne({ username: username.trim(), templateName });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Template deleted successfully' });
        } else {
            res.status(404).json({ error: 'Template not found' });
        }
    } catch (err) {
        console.error('Error deleting template:', err);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

// Existing exports...



module.exports = router;