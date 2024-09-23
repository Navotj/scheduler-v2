// File: routes/groupRoutes.js

const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Availability = require('../models/Availability');
const Profile = require('../models/Profile');

// Route to create a group and add the creator as a member
router.post('/create', async (req, res) => {
  const { groupName, username } = req.body;

  if (!groupName || !username) {
    return res.status(400).json({ error: 'Group name and username are required.' });
  }

  try {
    // Check if a group with the same name and members already exists
    const existingGroup = await Group.findOne({
      groupName,
      members: [username.trim()],
    });
    if (existingGroup) {
      return res.status(400).json({
        error: 'A group with the same name and members already exists',
      });
    }

    // Create the new group with the creator as the first member
    const newGroup = new Group({
      groupName,
      members: [username.trim()],
    });

    await newGroup.save();
    res.status(200).json({ message: 'Group created successfully', group: newGroup });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Route to get groups where the user is a member
router.get('/user', async (req, res) => {
  const { username } = req.query;

  try {
    const groups = await Group.find({ members: username.trim() });
    console.log('Groups fetched for user:', groups);
    res.status(200).json({ groups });
  } catch (err) {
    console.error('Error fetching user groups:', err);
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
});

// Route to remove a member from a group
router.post('/removeMember', async (req, res) => {
  const { groupId, username } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Remove the member from the group
    group.members = group.members.filter((member) => member !== username.trim());
    await group.save();

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Route to add a member to a group
router.post('/addMember', async (req, res) => {
  const { groupId, username } = req.body;

  try {
    // Check if the user exists
    const user = await Profile.findOne({ username: username.trim() });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user is already a member
    if (group.members.includes(username.trim())) {
      return res
        .status(400)
        .json({ error: 'User is already a member of the group' });
    }

    // Add the user to the group
    group.members.push(username.trim());
    await group.save();

    res.status(200).json({ message: 'Member added successfully' });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Route to get group availability
router.get('/availability', async (req, res) => {
  const { groupId } = req.query;

  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required' });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const usernames = group.members;
    const availabilities = await Availability.find({ username: { $in: usernames } });

    // Log the availabilities for debugging
    console.log('Fetched availabilities:', availabilities);

    res.status(200).json({ availabilities });
  } catch (err) {
    console.error('Error fetching group availability:', err);
    res.status(500).json({ error: 'Failed to fetch group availability' });
  }
});

// Route to delete a group
router.delete('/delete', async (req, res) => {
  const { groupId } = req.body;

  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required' });
  }

  try {
    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

module.exports = router;
