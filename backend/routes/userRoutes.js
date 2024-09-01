const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Credentials = require('../models/Credentials');
const bcrypt = require('bcrypt');

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const credentials = await Credentials.findOne({ username });
        if (!credentials || !(await bcrypt.compare(password, credentials.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', username: credentials.username });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const credentialsExist = await Credentials.findOne({ username });
        if (credentialsExist) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newCredentials = new Credentials({ username, password });
        await newCredentials.save();

        const newProfile = new Profile({ username });
        await newProfile.save();

        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    const { username } = req.query;

    try {
        const profile = await Profile.findOne({ username });
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(profile);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    const { username, displayName, age, languagesKnown, experienceLevel, description, discordTag } = req.body;

    try {
        const profile = await Profile.findOneAndUpdate(
            { username },
            { displayName, age, languagesKnown, experienceLevel, description, discordTag },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated', profile });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
