const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DefaultAvailabilitySchema = new Schema({
    username: { type: String, required: true },
    defaultWeek: [
        {
            day: { type: Number, required: true }, // 0-6 for days of the week
            time: { type: Number, required: true }, // 0-47 for time slots
        },
    ],
});

const DefaultAvailability = mongoose.model('DefaultAvailability', DefaultAvailabilitySchema);
module.exports = DefaultAvailability;
