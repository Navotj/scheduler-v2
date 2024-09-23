// File: src/components/Group.js

import React, { useState } from 'react';
import axios from 'axios';
import GroupAvailability from './GroupAvailability';
import '../styles/groupStyles.css';

const Group = ({ group, username, onDelete }) => {
  // Hooks declarations
  const [minPlayers, setMinPlayers] = useState(1);
  const [minSessionLength, setMinSessionLength] = useState(1); // in hours
  const [availabilityData, setAvailabilityData] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [memberUsername, setMemberUsername] = useState('');
  const [addMemberError, setAddMemberError] = useState('');

  // Use a default empty object for 'group' if it's undefined
  group = group || {};

  // Use a default empty array for 'members' if it's undefined
  const members = Array.isArray(group.members) ? group.members : [];

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleRemoveMember = async (memberUsername) => {
    if (memberUsername === username) {
      // Do nothing or show a message that the user cannot remove themselves
      return;
    }

    try {
      await axios.post('http://localhost:5000/groups/removeMember', {
        groupId: group._id,
        username: memberUsername,
      });
      // Update the group's members locally
      group.members = members.filter((member) => member !== memberUsername);
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member.');
    }
  };

  const handleAddMember = async () => {
    if (memberUsername.trim() === '') {
      setAddMemberError('Username cannot be empty.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/groups/addMember', {
        groupId: group._id,
        username: memberUsername.trim(),
      });
      // Update the group's members locally
      group.members.push(memberUsername.trim());
      setMemberUsername('');
      setAddMemberError('');
    } catch (err) {
      console.error('Error adding member:', err);
      setAddMemberError('Failed to add member.');
    }
  };

  const handleFindAvailability = async () => {
    try {
      console.log('Find Availability clicked');
      const response = await axios.get('http://localhost:5000/groups/availability', {
        params: {
          groupId: group._id,
          minPlayers,
          minSessionLength: minSessionLength * 60, // Convert hours to minutes
        },
      });
      console.log('Availability response:', response.data);
      setAvailabilityData(response.data.availabilities);
      setError('');
    } catch (err) {
      console.error('Failed to fetch availability', err);
      setError('Failed to fetch availability');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete('http://localhost:5000/groups/delete', {
        data: { groupId: group._id },
      });
      // Notify parent component to remove this group from the list
      if (onDelete) {
        onDelete(group._id);
      }
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('Failed to delete group.');
    }
  };

  // Handle the case where 'group' might not have necessary data
  if (!group || !group.groupName) {
    return <div>No group data available.</div>;
  }

  return (
    <div className="group-container">
      <div className="group-header" onClick={handleToggleDetails}>
        <h3 style={{ cursor: 'pointer' }}>
          {group.groupName || 'Unnamed Group'}
        </h3>
      </div>
      {showDetails && (
        <>
          <div className="group-content">
            <div className="members-list">
              <h4>Members</h4>
              {members.length > 0 ? (
                <div className="member-items">
                  {members.map((member) => (
                    <div className="member-item" key={member}>
                      <span>{member}</span>
                      {member !== username && (
                        <button
                          onClick={() => handleRemoveMember(member)}
                          className="remove-member-button"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No members in this group.</p>
              )}
              <div className="add-member-form">
                <input
                  type="text"
                  value={memberUsername}
                  onChange={(e) => setMemberUsername(e.target.value)}
                  placeholder="Enter username to add"
                />
                <button onClick={handleAddMember}>Add Member</button>
                {addMemberError && <div className="error">{addMemberError}</div>}
              </div>
            </div>

            <div className="availability-form">
              {error && <div className="error">{error}</div>}
              <div className="availability-inputs">
                <label>
                  Minimum Number of Players:
                  <input
                    type="number"
                    min="1"
                    max={members.length > 0 ? members.length : 1}
                    value={minPlayers}
                    onChange={(e) => setMinPlayers(Number(e.target.value))}
                  />
                </label>
                <label>
                  Minimum Session Length (hours):
                  <input
                    type="number"
                    min="1"
                    value={minSessionLength}
                    onChange={(e) => setMinSessionLength(Number(e.target.value))}
                  />
                </label>
                <button onClick={handleFindAvailability}>Find Availability</button>
              </div>

              {availabilityData && (
                <GroupAvailability
                  availabilities={availabilityData}
                  usernames={members}
                  minPlayers={minPlayers}
                  minSessionLength={minSessionLength}
                />
              )}
            </div>
          </div>
          <button className="delete-group-button" onClick={handleDeleteGroup}>
            Delete Group
          </button>
        </>
      )}
    </div>
  );
};

export default Group;
