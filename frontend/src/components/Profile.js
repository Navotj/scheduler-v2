import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';

const Profile = ({ username }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        displayName: '',
        age: '',
        languagesKnown: '',
        experienceLevel: '',
        description: '',
        discordTag: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/profile?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [username]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        setIsEditing(false);

        try {
            const response = await fetch('http://localhost:5000/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, ...profile }),
            });

            if (!response.ok) {
                console.error('Failed to save profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="profile-field">
                <label>Username:</label>
                <input type="text" value={username || ''} disabled />
            </div>
            <div className="profile-field">
                <label>Display Name:</label>
                <input
                    type="text"
                    name="displayName"
                    value={profile.displayName || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="profile-field">
                <label>Age:</label>
                <input
                    type="number"
                    name="age"
                    value={profile.age || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="profile-field">
                <label>Languages Known:</label>
                <input
                    type="text"
                    name="languagesKnown"
                    value={profile.languagesKnown || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="profile-field">
                <label>D&D Experience Level:</label>
                <input
                    type="text"
                    name="experienceLevel"
                    value={profile.experienceLevel || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="profile-field">
                <label>Description:</label>
                <textarea
                    name="description"
                    value={profile.description || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="profile-field">
                <label>Discord Tag:</label>
                <input
                    type="text"
                    name="discordTag"
                    value={profile.discordTag || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="profile-buttons">
                {isEditing ? (
                    <button onClick={handleSaveClick}>Save Profile</button>
                ) : (
                    <button onClick={handleEditClick}>Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default Profile;
