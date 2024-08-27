// backend/models/availability.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
    username: { type: String, required: true },
    times: [
        {
            startDate: { type: Number, required: true }, // Use Number to store epoch time
            endDate: { type: Number, required: true },   // Use Number to store epoch time
        },
    ],
});

const Availability = mongoose.model('Availability', AvailabilitySchema);
module.exports = Availability;
