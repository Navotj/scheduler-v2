
const mongoose = require('mongoose');

// Define a schema for user availability with separate week field
const availabilitySchema = new mongoose.Schema({
    day: Number,
    times: [{ start: Number, end: Number }]
});

const weekAvailabilitySchema = new mongoose.Schema({
    username: String,
    week: Number,
    availability: [availabilitySchema]
});

module.exports = mongoose.model('WeekAvailability', weekAvailabilitySchema);
