const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameName: { type: String, required: true },
    gameSystem: { type: String, required: true },
    intendedPlayerCount: { type: Number, required: true },
    gameModule: { type: String, required: true },
    language: { type: String, required: true },
    startingLevel: { type: String, required: true },
    intendedGameLength: { type: String, required: true },
    homebrewAvailability: { type: Boolean, required: true },
    age: { type: String, required: true },
    maxPlayers: { type: Number, required: true },
    gameFrequency: { type: String, required: true },
    publicity: { type: String, enum: ['public', 'private'], default: 'public' },
    owner: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    players: [{ type: String }], // Array of usernames
}, { collection: 'games' }); // Ensures the collection name is 'games'

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
