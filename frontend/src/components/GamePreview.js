import React from 'react';
import '../styles/Games.css';
import '../styles/TagsManager.css';  // Import the TagsManager styles for consistent tag styling
import moment from 'moment-timezone';
import { renderTag, tagCategories } from './TagsManager';  // Import the renderTag function and tagCategories
import { FaClock, FaUser, FaCalendar, FaGamepad, FaMapMarkerAlt  } from 'react-icons/fa'; // Import icons

const GamePreview = ({
    username, gameName, gameSystem, language, frequencyNumber, frequencyInterval, frequencyTimeFrame,
    intendedGameLengthMin, intendedGameLengthMax, intendedGameLengthUnit, minPlayers, maxPlayers,
    minAge, maxAge, croppedImage, gameDescription, enabledTags, sessionLengthMin, sessionLengthMax, sessionDays,
    startingLevel, location, startHour
}) => {
    // Logging the sessionDays to ensure it's passed correctly
    console.log('Session Days:', sessionDays);

    // Get the user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


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
        // Ensure sessionDays is an array before processing
        if (!Array.isArray(sessionDays) || sessionDays.length === 0) {
            return ""; // No session days specified
        }
    
        // Check if all days are set
        const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const selectedDays = sessionDays.filter(dayObj => dayObj.available).map(dayObj => dayObj.day.toLowerCase());
    
        if (selectedDays.length === 7) {
            return "any day";
        }
    
        return selectedDays
            .map(day => day.charAt(0).toUpperCase() + day.slice(1))  // Capitalize first letter of the day
            .join('/');
    };
    

    return (
        <div className="game-preview-card">
            <div className="game-preview-header">
                <span className="game-title">{gameName}</span>
                <span className="gm-name">{username}</span>
                <span className="system">{gameSystem}</span>
            </div>
            {croppedImage && <div className="game-preview-banner" style={{ backgroundImage: `url(${croppedImage})`, backgroundSize: 'cover' }}></div>}
            <div className="game-preview-body">
                {location && (
                    <div className="long-info">
                        <FaMapMarkerAlt /> {location}
                    </div>
                )}
                <div className="long-info">
                    <FaCalendar />
                    {formatFrequency()}
                    {formatSessionDays() && `, ${formatSessionDays()}`}
                {(sessionLengthMin || sessionLengthMax || startHour) && (
                    <>
                        {startHour && (
                            `, ${moment.utc(startHour).tz(userTimezone).format('h:mm a')} start`
                        )}
                        {(sessionLengthMin || sessionLengthMax) && (
                            `, ${sessionLengthMin && sessionLengthMax ? `${sessionLengthMin}-${sessionLengthMax}` : sessionLengthMin || sessionLengthMax} hour${(sessionLengthMin > 1 || sessionLengthMax > 1) ? 's' : ''}`
                        )}
                    </>
                )}
                </div>
                <div className="long-info">
                {(minPlayers || maxPlayers || minAge || maxAge) && (
                    <div className="long-info">
                        <FaUser /> 
                        {minPlayers && !maxPlayers && `Min ${minPlayers} players`}
                        {!minPlayers && maxPlayers && `Max ${maxPlayers} players`}
                        {minPlayers && maxPlayers && `${minPlayers} to ${maxPlayers} players`}
                        {(minAge || maxAge) && (
                            <>
                                {minAge && !maxAge && `, min age ${minAge}`}
                                {!minAge && maxAge && `, max age ${maxAge}`}
                                {minAge && maxAge && `, ages ${minAge} to ${maxAge}`}
                            </>
                        )}
                        {`, ${language} speaking`}
                    </div>
                )}

                </div>
                <div className="long-info">
                <div className="long-info">
                {(intendedGameLengthMin || intendedGameLengthMax) && (
                    <div className="long-info">
                        <FaClock />
                        {intendedGameLengthMin && !intendedGameLengthMax && `${intendedGameLengthMin} ${intendedGameLengthUnit}${intendedGameLengthMin > 1 ? 's' : ''}`}
                        {!intendedGameLengthMin && intendedGameLengthMax && `Up to ${intendedGameLengthMax} ${intendedGameLengthUnit}${intendedGameLengthMax > 1 ? 's' : ''}`}
                        {intendedGameLengthMin && intendedGameLengthMax && `${intendedGameLengthMin} to ${intendedGameLengthMax} ${intendedGameLengthUnit}${(intendedGameLengthMax > 1 || intendedGameLengthMin > 1) ? 's' : ''}`}
                    </div>
                )}
            </div>
                </div>
                <div className="long-info">
                {startingLevel && (
                    <div className="long-info">
                        <FaGamepad /> Level {startingLevel} start
                    </div>
                )}
                </div>
                {gameDescription && 
                    <p className="game-description">
                        {gameDescription}
                    </p>
                }

            </div>
            <div className="game-preview-footer">
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
