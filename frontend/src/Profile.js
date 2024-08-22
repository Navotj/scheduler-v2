import React, { useState } from 'react';
import './styles.css';

const Profile = ({ username }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [age, setAge] = useState('');
    const [languages, setLanguages] = useState('');
    const [dndExperience, setDndExperience] = useState('');
    const [description, setDescription] = useState('');
    const [discordTag, setDiscordTag] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSaveProfile = () => {
        // Save the updated profile details here (e.g., send them to the backend)
        setIsEditing(false);
    };

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            // Handle password change logic here (e.g., send the new password to the backend)
            alert('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            alert('New passwords do not match. Please try again.');
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            <div className="profile-info">
                <label>Username:</label>
                <p>{username}</p>
                
                {isEditing ? (
                    <>
                        <label>Display Name:</label>
                        <input 
                            type="text" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)} 
                        />

                        <label>Age:</label>
                        <input 
                            type="number" 
                            value={age} 
                            onChange={(e) => setAge(e.target.value)} 
                        />

                        <label>Languages Known:</label>
                        <input 
                            type="text" 
                            value={languages} 
                            onChange={(e) => setLanguages(e.target.value)} 
                        />

                        <label>D&D Experience Level:</label>
                        <input 
                            type="text" 
                            value={dndExperience} 
                            onChange={(e) => setDndExperience(e.target.value)} 
                        />

                        <label>Description:</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                        />

                        <label>Discord Tag:</label>
                        <input 
                            type="text" 
                            value={discordTag} 
                            onChange={(e) => setDiscordTag(e.target.value)} 
                        />

                        <button onClick={handleSaveProfile}>Save Profile</button>
                    </>
                ) : (
                    <>
                        <label>Display Name:</label>
                        <p>{displayName}</p>

                        <label>Age:</label>
                        <p>{age}</p>

                        <label>Languages Known:</label>
                        <p>{languages}</p>

                        <label>D&D Experience Level:</label>
                        <p>{dndExperience}</p>

                        <label>Description:</label>
                        <p>{description}</p>

                        <label>Discord Tag:</label>
                        <p>{discordTag}</p>

                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </>
                )}
            </div>

            <div className="change-password">
                <h3>Change Password</h3>
                <input 
                    type="password" 
                    placeholder="Current Password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button onClick={handleChangePassword}>Change Password</button>
            </div>
        </div>
    );
};

export default Profile;
