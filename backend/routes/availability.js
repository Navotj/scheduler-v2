const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Route to create a new game
router.post('/create', async (req, res) => {
    const {
        gameName,
        gameSystem,
        language,
        startingLevel,
        intendedGameLengthMin,
        intendedGameLengthMax,
        intendedGameLengthUnit,
        minAge,
        maxAge,
        minPlayers,
        maxPlayers,
        frequencyNumber,
        frequencyInterval,
        frequencyTimeFrame,
        gameDescription,
        gameImage,
        enabledTags,
        owner,
        visibility,
        sessionLengthMin,
        sessionLengthMax,
        sessionDays  // Expect sessionDays as an array of objects with day and available properties
    } = req.body;

    try {
        const game = new Game({
            gameName,
            gameSystem,
            language,
            startingLevel,
            intendedGameLengthMin,
            intendedGameLengthMax,
            intendedGameLengthUnit,
            minAge,
            maxAge,
            minPlayers,
            maxPlayers,
            frequencyNumber,
            frequencyInterval,
            frequencyTimeFrame,
            gameDescription,
            gameImage,
            enabledTags: JSON.parse(enabledTags),
            owner,
            visibility,
            sessionLengthMin,
            sessionLengthMax,
            sessionDays  // Store the sessionDays array of objects
        });

        await game.save();
        res.status(200).json({ gameId: game._id });
    } catch (err) {
        console.error('Error creating game:', err.message || err);
        res.status(500).json({ error: 'Failed to create game' });
    }
});

// Route to get a game by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const game = await Game.findById(id).lean();
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        console.error('Error fetching game:', err.message || err);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

// Route to fetch all public games
router.get('/public', async (req, res) => {
    try {
        const games = await Game.find({ visibility: 'public' });
        res.status(200).json(games);
    } catch (err) {
        console.error('Error fetching public games:', err.message || err);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Route to fetch all games created by a specific user
router.get('/user/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const games = await Game.find({ owner: username });
        if (!games) {
            return res.status(404).json({ error: 'No games found for this user' });
        }
        res.status(200).json(games);
    } catch (err) {
        console.error('Error fetching user games:', err.message || err);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

module.exports = router;
