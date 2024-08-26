// backend/models/availability.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
    username: { type: String, required: true },
    times: [
        {
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
        },
    ],
});

const Availability = mongoose.model('Availability', AvailabilitySchema);

module.exports = Availability;
