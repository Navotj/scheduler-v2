import React from 'react';
import './styles.css';

const GamePreview = ({ username, gameName, gameSystem, language, frequencyNumber, frequencyInterval, frequencyTimeFrame, intendedGameLengthMin, intendedGameLengthMax, intendedGameLengthUnit, minPlayers, maxPlayers, croppedImage, gameDescription }) => {
    return (
        <div className="game-preview-card">
            {croppedImage && <div className="game-preview-banner" style={{ backgroundImage: `url(${croppedImage})` }}></div>}
            <div className="game-preview-header">
                <span className="gm-name">{username}</span>
                <h2 className="game-title">{gameName}</h2>
            </div>
            <div className="game-preview-body">
                <p className="game-info">
                    {gameSystem && <>System: {gameSystem}<br /></>}
                    {language && <>Language: {language}<br /></>}
                    Frequency: {
                        frequencyNumber === "1" ? 
                        `Once per ${frequencyInterval > 1 ? frequencyInterval + " " : ""}${frequencyTimeFrame}${frequencyInterval > 1 ? "s" : ""}` : 
                        frequencyNumber === "2" ? 
                        `Twice per ${frequencyInterval > 1 ? frequencyInterval + " " : ""}${frequencyTimeFrame}${frequencyInterval > 1 ? "s" : ""}` : 
                        `${frequencyNumber} times per ${frequencyInterval > 1 ? frequencyInterval + " " : ""}${frequencyTimeFrame}${frequencyInterval > 1 ? "s" : ""}`
                    }<br />
                    {intendedGameLengthMin && intendedGameLengthMax && (intendedGameLengthMin === intendedGameLengthMax
                        ? `Length: ${intendedGameLengthMin} ${intendedGameLengthUnit}${intendedGameLengthMax > 1 ? 's' : ''}`
                        : `Length: ${intendedGameLengthMin}-${intendedGameLengthMax} ${intendedGameLengthUnit}${intendedGameLengthMax > 1 ? 's' : ''}`
                    )}
                </p>
                {gameDescription && 
                    <p className="game-description">
                        {gameDescription}
                    </p>
                }
            </div>
            <div className="game-preview-footer">
                {minPlayers && maxPlayers && (minPlayers === maxPlayers
                    ? <span className="players-info">Players: {minPlayers}</span>
                    : <span className="players-info">Players: {minPlayers} - {maxPlayers}</span>
                )}
            </div>
        </div>
    );
};

export default GamePreview;
