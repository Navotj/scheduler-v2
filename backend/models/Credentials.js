const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const CredentialsSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

CredentialsSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const Credentials = mongoose.model('Credentials', CredentialsSchema);
module.exports = Credentials;
