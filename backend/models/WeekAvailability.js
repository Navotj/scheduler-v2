const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    start: Date,
    end: Date
});

const weekAvailabilitySchema = new mongoose.Schema({
    username: String,
    week: Number,
    availability: [availabilitySchema]
});

const WeekAvailability = mongoose.model('WeekAvailability', weekAvailabilitySchema);

module.exports = WeekAvailability;
