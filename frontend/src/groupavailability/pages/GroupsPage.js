// File: src/pages/GroupsPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Group from '../components/Group';
import '../styles/groupsPageStyles.css';

const GroupsPage = ({ username }) => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch existing groups where the user is a member
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/groups/user', {
          params: { username },
        });
        console.log('Fetched groups:', response.data.groups);
        setGroups(response.data.groups || []);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    fetchGroups();
  }, [username]);

  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      setError('Group name cannot be empty.');
      return;
    }

    try {
      // Check if a group with the same name already exists
      const existingGroup = groups.find(
        (group) => group.groupName === groupName.trim()
      );
      if (existingGroup) {
        setError('A group with this name already exists.');
        return;
      }

      const response = await axios.post('http://localhost:5000/groups/create', {
        groupName: groupName.trim(),
        username,
      });
      setGroups([...groups, response.data.group]);
      setGroupName('');
      setError('');
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group.');
    }
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter((group) => group._id !== groupId));
  };

  return (
    <div className="groups-page-container">
      {groups.length > 0 ? (
        groups.map((group) => (
          <Group
            key={group._id}
            group={group}
            username={username}
            onDelete={handleDeleteGroup}
          />
        ))
      ) : (
        <p>You are not a member of any groups yet.</p>
      )}

      <div className="create-group-form">
        <h3>Create New Group</h3>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
};

export default GroupsPage;
