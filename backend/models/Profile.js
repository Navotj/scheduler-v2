const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    username: { type: String, required: true, unique: true },
    displayName: { type: String, default: '' },
    age: { type: Number, default: null },
    languagesKnown: { type: String, default: '' },
    experienceLevel: { type: String, default: '' },
    description: { type: String, default: '' },
    discordTag: { type: String, default: '' },
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;
