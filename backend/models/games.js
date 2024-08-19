const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isSpecial: { type: Boolean, default: false }
});

const gameSchema = new mongoose.Schema({
    gameName: { type: String, required: true },
    gameSystem: { type: String, required: true },
    language: { type: String, required: true },
    startingLevel: Number,
    intendedGameLengthMin: Number,
    intendedGameLengthMax: Number,
    intendedGameLengthUnit: String,
    minAge: Number,
    maxAge: Number,
    minPlayers: Number,
    maxPlayers: Number,
    frequencyNumber: Number,
    frequencyInterval: Number,
    frequencyTimeFrame: String,
    gameDescription: String,
    gameImage: String,
    enabledTags: [tagSchema],  // This is now an array of objects
    enabledTabs: Object,
    owner: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
