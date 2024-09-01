import React from 'react';
import '../styles/Games.css';
import '../styles/TagsManager.css';  // Import the TagsManager styles for consistent tag styling
import { renderTag, tagCategories } from './TagsManager';  // Import the renderTag function and tagCategories
import { FaClock, FaUser } from 'react-icons/fa'; // Import icons

const GamePreview = ({
    username, gameName, gameSystem, language, frequencyNumber, frequencyInterval, frequencyTimeFrame,
    intendedGameLengthMin, intendedGameLengthMax, intendedGameLengthUnit, minPlayers, maxPlayers,
    minAge, maxAge, croppedImage, gameDescription, enabledTags, sessionLengthMin, sessionLengthMax, sessionDays
}) => {
    // Logging the sessionDays to ensure it's passed correctly
    console.log('Session Days:', sessionDays);

    const formatFrequency = () => {
        let frequencyText;
        if (frequencyNumber === 1) {
            frequencyText = `Once per ${frequencyInterval > 1 ? frequencyInterval + " " : ""}${frequencyTimeFrame}${frequencyInterval > 1 ? "s" : ""}`;
        } else if (frequencyNumber === 2) {
            frequencyText = `Twice per ${frequencyInterval > 1 ? frequencyInterval + " " : ""}${frequencyTimeFrame}${frequencyInterval > 1 ? "s" : ""}`;
        } else {
            frequencyText = `${frequencyNumber} times per ${frequencyInterval > 1 ? frequencyInterval + " " : ""}${frequencyTimeFrame}${frequencyInterval > 1 ? "s" : ""}`;
        }
        return frequencyText;
    };

    const formatSessionDays = () => {
        if (!sessionDays || Object.keys(sessionDays).length === 0 || Object.keys(sessionDays).every(day => !sessionDays[day])) {
            return "No session days specified";
        }

        return Object.keys(sessionDays)
            .filter(day => sessionDays[day])  // Filter out days that are false
            .map(day => day.charAt(0).toUpperCase() + day.slice(1))  // Capitalize first letter
            .join(', ');
    };

    return (
        <div className="game-preview-card">
            <div className="game-preview-header">
                <span className="gm-name">{username}</span>
                <h2 className="game-title">{gameName}</h2>
            </div>
            {croppedImage && <div className="game-preview-banner" style={{ backgroundImage: `url(${croppedImage})`, backgroundSize: 'cover' }}></div>}
            <div className="game-preview-body">
                <p className="game-info">
                    {gameSystem && <>System: {gameSystem}<br /></>}
                    {language && <>Language: {language}<br /></>}
                    <FaClock /> {formatFrequency()} on {formatSessionDays()}, for {sessionLengthMin}-{sessionLengthMax} hours per session.<br />
                </p>
                {gameDescription && 
                    <p className="game-description">
                        {gameDescription}
                    </p>
                }
            </div>
            <div className="game-preview-footer">
            {minPlayers && maxPlayers && (
                <span className="players-info">
                    <FaUser /> {minPlayers} to {maxPlayers} players, ages {minAge} to {maxAge}
                </span>
            )}
            <div className="tags-footer-container">
                <div className="tags-container">
                    {enabledTags.map((tag, index) => {
                        const tagObject = tagCategories.flatMap(category => category.tags).find(t => t.name === tag.name);
                        const category = tagCategories.find(category => category.tags.some(t => t.name === tagObject?.name));

                        if (tagObject && category) {
                            return renderTag(tagObject, category, () => {}, () => {}, enabledTags);
                        } else {
                            console.error(`Tag or category not found for: ${tagObject ? tagObject.name : tag.name}`);
                            return null;
                        }
                    })}
                </div>
            </div>
        </div>

        </div>
    );
};

export default GamePreview;
