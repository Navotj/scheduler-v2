const mongoose = require('mongoose');

const sessionDaysSchema = new mongoose.Schema({
    sun: { type: Boolean, default: false },
    mon: { type: Boolean, default: false },
    tue: { type: Boolean, default: false },
    wed: { type: Boolean, default: false },
    thu: { type: Boolean, default: false },
    fri: { type: Boolean, default: false },
    sat: { type: Boolean, default: false }
});

const GameSchema = new mongoose.Schema({
    gameName: String,
    gameSystem: String,
    language: String,
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
    enabledTags: Array,
    owner: String,
    visibility: String,
    sessionLengthMin: Number,
    sessionLengthMax: Number,
    sessionDays: sessionDaysSchema  // Use the explicitly defined schema for sessionDays
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
