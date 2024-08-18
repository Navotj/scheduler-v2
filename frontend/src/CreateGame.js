import React, { useState } from 'react';
import './styles.css';

const CreateGame = ({ username }) => {
    const [gameName, setGameName] = useState('');
    const [gameSystem, setGameSystem] = useState('');
    const [gameModule, setGameModule] = useState('');
    const [language, setLanguage] = useState('');
    const [startingLevel, setStartingLevel] = useState('');
    const [intendedGameLengthMin, setIntendedGameLengthMin] = useState('');
    const [intendedGameLengthMax, setIntendedGameLengthMax] = useState('');
    const [intendedGameLengthUnit, setIntendedGameLengthUnit] = useState('session');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [minPlayers, setMinPlayers] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [frequencyNumber, setFrequencyNumber] = useState(1);
    const [frequencyInterval, setFrequencyInterval] = useState(1);
    const [frequencyTimeFrame, setFrequencyTimeFrame] = useState('week');
    const [gameDescription, setGameDescription] = useState('');
    const [gameImage, setGameImage] = useState(null);
    const [enabledTabs, setEnabledTabs] = useState({
        classes: false,
        subclasses: false,
        races: false,
        feats: false,
    });

    const gameSystems = ['D&D 3.5e', 'D&D 5e', 'Pathfinder', 'Pathfinder 2e', 'Call of Cthulhu', 'Starfinder', 'Other'];
    const languages = ['English', 'Spanish', 'French', 'German', 'Other'];
    const timeFrames = ['day', 'week', 'month'];
    const gameLengthUnits = ['session', 'day', 'week', 'month', 'year'];

    const handleFrequencyNumberChange = (e) => {
        const value = e.target.value;
        setFrequencyNumber(value);
        
        // Reset the frequencyInterval to "1" if the frequencyNumber is changed from "1"
        if (value !== "1") {
            setFrequencyInterval("1");
        }
    };

    const handleImageUpload = (e) => {
        setGameImage(e.target.files[0]);
    };

    const toggleTab = (tabName) => {
        setEnabledTabs((prevTabs) => ({
            ...prevTabs,
            [tabName]: !prevTabs[tabName],
        }));
    };

    const handleCreateGame = async () => {
        const formData = new FormData();
        formData.append('gameName', gameName);
        formData.append('gameSystem', gameSystem);
        formData.append('gameModule', gameModule);
        formData.append('language', language);
        formData.append('startingLevel', startingLevel);
        formData.append('intendedGameLengthMin', intendedGameLengthMin);
        formData.append('intendedGameLengthMax', intendedGameLengthMax);
        formData.append('intendedGameLengthUnit', intendedGameLengthUnit);
        formData.append('minAge', minAge);
        formData.append('maxAge', maxAge);
        formData.append('minPlayers', minPlayers);
        formData.append('maxPlayers', maxPlayers);
        formData.append('frequencyNumber', frequencyNumber);
        formData.append('frequencyInterval', frequencyInterval);
        formData.append('frequencyTimeFrame', frequencyTimeFrame);
        formData.append('gameDescription', gameDescription);
        if (gameImage) {
            formData.append('gameImage', gameImage);
        }
        formData.append('enabledTabs', JSON.stringify(enabledTabs));
        formData.append('owner', username);
        formData.append('createdAt', new Date().toISOString());

        try {
            const response = await fetch('http://localhost:5000/games', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Game created successfully!');
            } else {
                alert('Failed to create game.');
            }
        } catch (error) {
            console.error('Error creating game:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="form-container">
            <h2>New Game</h2>
            <div className="form-grid-three-cols">
                <div className="col col-left">
                    <label>Game Title:</label>
                    <input 
                        type="text" 
                        value={gameName} 
                        onChange={(e) => setGameName(e.target.value)} 
                        required
                    />
                    <label>Game System:</label>
                    <select 
                        value={gameSystem} 
                        onChange={(e) => setGameSystem(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Select Game System</option>
                        {gameSystems.map((system, index) => (
                            <option key={index} value={system}>{system}</option>
                        ))}
                    </select>
                    <label>Language:</label>
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Select Language</option>
                        {languages.map((lang, index) => (
                            <option key={index} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
                <div className="col col-middle">
                    <label>Starting Level:</label>
                    <input 
                        type="number" 
                        value={startingLevel} 
                        onChange={(e) => setStartingLevel(e.target.value)} 
                        min="0" 
                    />
                    <label>Intended Game Length:</label>
                    <div className="game-length-container">
                        <input 
                            type="number" 
                            value={intendedGameLengthMin} 
                            onChange={(e) => setIntendedGameLengthMin(e.target.value)} 
                            min="1"
                        />
                        <span>-</span>
                        <input 
                            type="number" 
                            value={intendedGameLengthMax} 
                            onChange={(e) => setIntendedGameLengthMax(e.target.value)} 
                            min={intendedGameLengthMin || "1"}
                        />
                        <select 
                            value={intendedGameLengthUnit} 
                            onChange={(e) => setIntendedGameLengthUnit(e.target.value)}
                        >
                            {gameLengthUnits.map((unit, index) => (
                                <option key={index} value={unit}>
                                    {unit}{intendedGameLengthMax > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="homebrew-options">
                        <div className="homebrew-option">
                            <button 
                                className={enabledTabs.classes ? 'enabled' : 'disabled'}
                                onClick={() => toggleTab('classes')}
                            >
                                Homebrew Classes
                            </button>
                            <button 
                                className={enabledTabs.subclasses ? 'enabled' : 'disabled'}
                                onClick={() => toggleTab('subclasses')}
                            >
                                Homebrew Subclasses
                            </button>
                        </div>
                        <div className="homebrew-option">
                            <button 
                                className={enabledTabs.races ? 'enabled' : 'disabled'}
                                onClick={() => toggleTab('races')}
                            >
                                Homebrew Races
                            </button>
                            <button 
                                className={enabledTabs.feats ? 'enabled' : 'disabled'}
                                onClick={() => toggleTab('feats')}
                            >
                                Homebrew Feats
                            </button>
                        </div>
                    </div>
                    <div className="age-container">
                        <div className="max-age">
                            <label>Max Age:</label>
                            <input 
                                type="number" 
                                value={maxAge} 
                                onChange={(e) => setMaxAge(e.target.value)} 
                                min={minAge || "0"}
                            />
                        </div>
                    </div>
                    <div className="player-count-container">
                        <div className="min-players">
                            <label>Min Players:</label>
                            <input 
                                type="number" 
                                value={minPlayers} 
                                onChange={(e) => setMinPlayers(e.target.value)} 
                                min="1" 
                            />
                        </div>
                        <div className="max-players">
                            <label>Max Players:</label>
                            <input 
                                type="number" 
                                value={maxPlayers} 
                                onChange={(e) => setMaxPlayers(e.target.value)} 
                                min="1" 
                            />
                        </div>
                    </div>
                    <div className="game-frequency-container">
                        <label>Game Frequency:</label>
                        <div className="frequency-inputs">
                        <input 
                            type="number" 
                            value={frequencyNumber} 
                            onChange={handleFrequencyNumberChange} 
                            min="1" 
                            max="9"
                        />
                        <input 
                            type="number" 
                            value={frequencyInterval} 
                            onChange={e => setFrequencyInterval(e.target.value)} 
                            disabled={frequencyNumber > 1} 
                            min="1" 
                            max="9"
                            style={{ backgroundColor: frequencyNumber > 1 ? '#333' : '#1e1e1e' }}
                        />
                            <select 
                                value={frequencyTimeFrame} 
                                onChange={e => setFrequencyTimeFrame(e.target.value)}
                            >
                                {timeFrames.map((frame, index) => (
                                    <option key={index} value={frame}>
                                        {frame}{frequencyInterval > 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <label>Game Image:</label>
                    <input 
                        type="file" 
                        onChange={handleImageUpload} 
                    />
                </div>
                <div className="col col-right">
                    <label>Game Description:</label>
                    <textarea 
                        value={gameDescription}
                        onChange={(e) => setGameDescription(e.target.value)}
                        rows="10"
                        style={{ resize: 'none', height: '100%' }}
                    />
                </div>
            </div>
            <button className="create-button" onClick={handleCreateGame}>Create Game</button>
        </div>
    );
};

export default CreateGame;
