const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeekTemplateSchema = new Schema({
    username: { type: String, required: true },
    templateName: { type: String, required: true }, // Added templateName field
    weekTemplate: [
        {
            day: { type: Number, required: true }, // 0-6 for days of the week
            time: { type: Number, required: true }, // 0-47 for time slots
        },
    ],
});

const WeekTemplate = mongoose.model('WeekTemplate', WeekTemplateSchema, 'templates'); // Collection name 'templates'
module.exports = WeekTemplate;
