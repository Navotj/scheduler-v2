const express = require('express');
const Game = require('../models/games'); // Adjust the path as necessary

const router = express.Router();

const multer = require('multer');
const upload = multer(); // You can configure this further as needed

router.post('/', upload.none(), async (req, res) => {
    try {
        // Parse the enabledTags field if it exists and is a string
        if (req.body.enabledTags) {
            req.body.enabledTags = JSON.parse(req.body.enabledTags);
        }

        const newGame = new Game(req.body);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error('Error creating game:', error.message, error.stack);
        res.status(500).json({ message: 'Failed to create game', error: error.message });
    }
});

// Get games by username
router.get('/user/:username', async (req, res) => {
    try {
        const games = await Game.find({ owner: req.params.username });
        res.status(200).json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Failed to fetch games' });
    }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(game);
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ message: 'Failed to fetch game' });
    }
});

// Update a game
router.put('/:id', async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGame) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(updatedGame);
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).json({ message: 'Failed to update game' });
    }
});

module.exports = router;
