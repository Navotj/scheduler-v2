const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  groupName: { type: String, required: true },
  groupCreator: { type: String, required: true },
  members: { type: [String], required: true },
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
