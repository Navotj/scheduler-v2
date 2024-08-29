const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Availability = require('../models/Availability');

router.post('/create', async (req, res) => {
    const { groupName, groupCreator } = req.body;
    try {
        const group = new Group({ groupName, groupCreator, members: [groupCreator] });
        await group.save();
        res.status(200).json({ groupId: group._id });
    } catch (err) {
        console.error('Error creating group:', err.message || err);
        res.status(500).json({ error: 'Failed to create group' });
    }
});


router.post('/addMember', async (req, res) => {
    const { groupId, username } = req.body;
    try {
        const group = await Group.findById(groupId);
        if (!group.members.includes(username)) {
            group.members.push(username);
            await group.save();
            res.status(200).json({ message: 'Member added successfully' });
        } else {
            res.status(400).json({ message: 'User is already a member of the group' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to add member' });
    }
});

router.post('/removeMember', async (req, res) => {
    const { groupId, username } = req.body;
    try {
        const group = await Group.findById(groupId);
        group.members = group.members.filter(member => member !== username);
        await group.save();
        res.status(200).json({ message: 'Member removed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

router.get('/availability', async (req, res) => {
    const { groupId } = req.query;
    try {
        const group = await Group.findById(groupId);
        const memberAvailabilities = await Availability.find({ username: { $in: group.members } });

        // Logic to compute common availability based on memberAvailabilities
        // Calculate overlapping time slots with minPlayers and minSessionLength

        res.status(200).json({ availability: commonAvailability });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

module.exports = router;
