const mongoose = require('mongoose');

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
    location: {
        type: String,
        enum: ['Online', 'In-person', 'Play-by-post'],
        required: true
    },
    startHour: {
        type: Date,
    },
    sessionLengthMin: Number,
    sessionLengthMax: Number,
    sessionDays: {
        type: [
            {
                day: { type: String, enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], required: true },
                available: { type: Boolean, default: false, required: true }
            }
        ],
        default: [
            { day: 'sun', available: false },
            { day: 'mon', available: false },
            { day: 'tue', available: false },
            { day: 'wed', available: false },
            { day: 'thu', available: false },
            { day: 'fri', available: false },
            { day: 'sat', available: false }
        ]
    }
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
