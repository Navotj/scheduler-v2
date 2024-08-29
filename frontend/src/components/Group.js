import React, { useState, useEffect } from 'react';
import '../styles/Group.css';

const Group = ({ username }) => {
    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [newMember, setNewMember] = useState('');
    const [groupId, setGroupId] = useState(null);
    const [availabilityResults, setAvailabilityResults] = useState([]);
    const [minPlayers, setMinPlayers] = useState(1);
    const [minSessionLength, setMinSessionLength] = useState(60); // in minutes

    // Fetch existing group if needed
    useEffect(() => {
        // Logic to fetch an existing group if needed
    }, []);

    const handleCreateGroup = async () => {
        try {
            const response = await fetch('http://localhost:5000/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupName, groupCreator: username }),
            });

            if (response.ok) {
                const data = await response.json();
                setGroupId(data.groupId);
                alert('Group created successfully');
            } else {
                console.error('Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleAddMember = async () => {
        if (!newMember) return;

        try {
            const response = await fetch('http://localhost:5000/groups/addMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId, username: newMember }),
            });

            if (response.ok) {
                setGroupMembers([...groupMembers, newMember]);
                setNewMember('');
            } else {
                console.error('Failed to add member');
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    const handleRemoveMember = async (memberToRemove) => {
        try {
            const response = await fetch('http://localhost:5000/groups/removeMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId, username: memberToRemove }),
            });

            if (response.ok) {
                setGroupMembers(groupMembers.filter(member => member !== memberToRemove));
            } else {
                console.error('Failed to remove member');
            }
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleFindAvailability = async () => {
        try {
            const response = await fetch(`http://localhost:5000/groups/availability?groupId=${groupId}&minPlayers=${minPlayers}&minSessionLength=${minSessionLength}`);
            if (response.ok) {
                const data = await response.json();
                setAvailabilityResults(data.availability);
            } else {
                console.error('Failed to fetch availability');
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    return (
        <div className="group-container">
            <h2>Create or Manage Group</h2>
            <div>
                <label>
                    Group Name:
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        disabled={!!groupId}
                    />
                </label>
            </div>
            <button onClick={handleCreateGroup} disabled={!!groupId}>
                Create Group
            </button>

            {groupId && (
                <>
                    <h3>Manage Members</h3>
                    <div>
                        <label>
                            Add Member:
                            <input
                                type="text"
                                value={newMember}
                                onChange={(e) => setNewMember(e.target.value)}
                            />
                        </label>
                        <button onClick={handleAddMember}>Add</button>
                    </div>
                    <ul className="group-members-list">
                        {groupMembers.map((member) => (
                            <li key={member}>
                                {member}
                                <button onClick={() => handleRemoveMember(member)}>Remove</button>
                            </li>
                        ))}
                    </ul>

                    <h3>Find Common Availability</h3>
                    <div>
                        <label>
                            Minimum Players Required:
                            <input
                                type="number"
                                value={minPlayers}
                                onChange={(e) => setMinPlayers(parseInt(e.target.value, 10))}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Minimum Session Length (minutes):
                            <input
                                type="number"
                                value={minSessionLength}
                                onChange={(e) => setMinSessionLength(parseInt(e.target.value, 10))}
                            />
                        </label>
                    </div>
                    <button onClick={handleFindAvailability}>
                        Find Available Times
                    </button>
                    <ul className="availability-results-list">
                        {availabilityResults.map((availability, index) => (
                            <li key={index}>
                                {new Date(availability.startDate).toLocaleString()} - {new Date(availability.endDate).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Group;
