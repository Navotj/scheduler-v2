// File: models/Group.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  groupName: { type: String, required: true, unique: true },
  members: [{ type: String, required: true }], // Array of usernames
  // Add other fields as needed
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
