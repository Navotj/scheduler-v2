const express = require('express');
const router = express.Router();
const Game = require('../models/games');

// Create a new game
router.post('/', async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).send(game);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get all public games
router.get('/public', async (req, res) => {
    try {
        const games = await Game.find({ publicity: 'public' });
        res.send(games);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get games by user
router.get('/user/:username', async (req, res) => {
    try {
        const games = await Game.find({
            $or: [
                { owner: req.params.username },
                { players: req.params.username }
            ]
        });
        res.send(games);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Join a game
router.post('/:id/join', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).send({ error: 'Game not found' });
        }

        if (game.players.includes(req.body.username)) {
            return res.status(400).send({ error: 'User already joined this game' });
        }

        game.players.push(req.body.username);
        await game.save();

        res.send(game);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
