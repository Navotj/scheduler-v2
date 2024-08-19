import React, { useState } from 'react';
import './styles.css';
import Cropper from 'react-easy-crop';
import TagsManager from './TagsManager'; // Import the TagsManager component

const CreateGame = ({ username }) => {
    const [gameName, setGameName] = useState('');
    const [gameSystem, setGameSystem] = useState('');
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
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropArea, setCropArea] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [enabledTags, setEnabledTags] = useState([]);
    const [enabledTabs, setEnabledTabs] = useState({
        classes: false,
        subclasses: false,
        races: false,
        feats: false,
    });

    const gameSystems = [
        // Dungeons & Dragons and Related Systems
        'D&D Original', 'D&D Basic/Expert', 'D&D 1e', 'D&D 2e', 'D&D 3e', 'D&D 3.5e', 'D&D 4e', 'D&D 5e',
        'Pathfinder', 'Pathfinder 2e', 'Dungeon Crawl Classics', 'Old-School Essentials', 'OSRIC',
    
        // Science Fiction and Cyberpunk
        'Cyberpunk 2020', 'Cyberpunk Red', 'Shadowrun', 'Starfinder', 'Traveller', 'Stars Without Number', 
        'Star Wars: Edge of the Empire', 'The Expanse', 'Alien RPG', 'Eclipse Phase', 'Mothership',
    
        // Horror
        'Call of Cthulhu', 'Delta Green', 'Vampire: The Masquerade', 'Werewolf: The Apocalypse', 
        'Mage: The Ascension', 'Hunter: The Reckoning', 'Changeling: The Dreaming', 'Wraith: The Oblivion', 
        'Promethean: The Created', 'Demon: The Fallen', 'Cthulhu Dark', 'Ten Candles',
    
        // Fantasy
        'Warhammer Fantasy Roleplay', 'Warhammer 40k: Dark Heresy', 'The One Ring', 'The Witcher', 'Earthdawn', 
        'Symbaroum', '13th Age', 'Dark Souls: The Roleplaying Game', 'Rolemaster', 'Tunnels & Trolls',
    
        // Superheroes and Modern
        'Mutants & Masterminds', 'GURPS', 'Savage Worlds', 'FATE', 'Cortex Prime', 'Champions', 
        'Hero System', 'Marvel Super Heroes', 'DC Heroes', 'Aberrant', 'City of Mist',
    
        // Powered by the Apocalypse (PbtA)
        'Powered by the Apocalypse', 'Dungeon World', 'Monster of the Week', 'Apocalypse World', 
        'Blades in the Dark', 'Urban Shadows', 'Masks: A New Generation', 'Fellowship', 'The Sprawl',
    
        // Indie and Story-Driven
        'Kids on Bikes', 'Tales from the Loop', 'Fiasco', 'The Quiet Year', 'Dread', 'Honey Heist', 
        'Lasers & Feelings', 'Mouse Guard', 'Burning Wheel', 'Torchbearer', 'Scum and Villainy', 
        'Bluebeard’s Bride',
    
        // Other / Miscellaneous
        'Numenera', 'The Strange', 'Genesys', 'Rifts', 'Paranoia', 'Torg Eternity', 
        'Legend of the Five Rings', 'Deadlands', 'Other'
    ];
    
    
    const languages = [
        'English', 'Spanish', 'French', 'German', 'Mandarin', 'Cantonese', 'Japanese', 'Korean', 'Portuguese', 
        'Italian', 'Russian', 'Hindi', 'Arabic', 'Bengali', 'Punjabi', 'Urdu', 'Persian', 'Turkish', 'Vietnamese', 
        'Thai', 'Dutch', 'Greek', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 
        'Romanian', 'Bulgarian', 'Serbian', 'Croatian', 'Slovak', 'Slovenian', 'Hebrew', 'Yiddish', 'Malay', 
        'Indonesian', 'Tagalog', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Pashto', 
        'Amharic', 'Somali', 'Swahili', 'Hausa', 'Zulu', 'Xhosa', 'Afrikaans', 'Irish', 'Welsh', 'Scots Gaelic', 
        'Basque', 'Catalan', 'Galician', 'Icelandic', 'Latvian', 'Lithuanian', 'Estonian', 'Albanian', 'Macedonian', 
        'Armenian', 'Georgian', 'Azerbaijani', 'Kazakh', 'Uzbek', 'Tajik', 'Kyrgyz', 'Turkmen', 'Mongolian', 
        'Nepali', 'Sinhalese', 'Burmese', 'Khmer', 'Lao', 'Tibetan', 'Maltese', 'Luxembourgish', 'Esperanto'
    ];
    
    const timeFrames = ['day', 'week', 'month'];
    const gameLengthUnits = ['session', 'day', 'week', 'month', 'year'];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setGameImage(reader.result);
                setShowCropper(true); // Show the cropper immediately after image is uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelCrop = () => {
        setShowCropper(false);
        setGameImage(null); // Reset the game image if canceled
    };
    
    const handleSaveCrop = (event) => {
        if (event) {
            event.preventDefault(); // Prevent the default form submission behavior
        }
        handleCropImage();
    };
    
    const handleCropImage = () => {
        if (!cropArea || !gameImage) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.src = gameImage;
        image.onload = () => {
            const aspectRatio = 2 / 1;
            canvas.width = cropArea.width;
            canvas.height = cropArea.width / aspectRatio;
            context.drawImage(
                image,
                cropArea.x,
                cropArea.y,
                cropArea.width,
                cropArea.height,
                0,
                0,
                canvas.width,
                canvas.height
            );
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                setCroppedImage(url);
                setShowCropper(false); // Hide cropper after cropping is done
            });
        };
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCropArea(croppedAreaPixels);
    };

    const toggleTab = (tabName) => {
        setEnabledTabs((prevTabs) => ({
            ...prevTabs,
            [tabName]: !prevTabs[tabName],
        }));
    };

    const handleMinPlayersChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setMinPlayers(value);
        if (value > maxPlayers) {
            setMaxPlayers(value); // Adjust maxPlayers to match minPlayers if it's lower
        }
    };
    
    const handleMaxPlayersChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= minPlayers) {
            setMaxPlayers(value);
        } else {
            setMaxPlayers(minPlayers); // Prevent maxPlayers from being set lower than minPlayers
        }
    };

    const handleFrequencyNumberChange = (e) => {
        const value = e.target.value;
        setFrequencyNumber(value);
        
        // Reset the frequencyInterval to "1" if the frequencyNumber is changed from "1"
        if (value !== "1") {
            setFrequencyInterval("1");
        }
    };

    const handleCreateGame = async () => {
        if (!gameName || !gameSystem || !language || !username) {
            alert('Please fill in all required fields');
            return;
        }
    
        const formData = new FormData();
        formData.append('gameName', gameName);
        formData.append('gameSystem', gameSystem);
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
        if (croppedImage) {
            formData.append('gameImage', croppedImage);
        }
        formData.append('enabledTags', JSON.stringify(enabledTags));
        formData.append('enabledTabs', JSON.stringify(enabledTabs));
        formData.append('owner', username);
        formData.append('createdAt', new Date().toISOString());
    
        // Debugging log
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
    
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
            <div className="form-grid-three-cols">
                <div className="col col-left">
                    <label className="small-label">Game Title:</label>
                    <input 
                        type="text" 
                        value={gameName} 
                        onChange={(e) => setGameName(e.target.value)} 
                        required
                    />
                    <label className="small-label">Game System:</label>
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
                    <label className="small-label">Language:</label>
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

                    {/* Use the TagsManager component here */}
                    <TagsManager 
                        enabledTags={enabledTags}
                        setEnabledTags={setEnabledTags}
                    />

                </div>
                <div className="col col-middle">
                    <label className="small-label">Starting Level:</label>
                    <input 
                        type="number" 
                        value={startingLevel} 
                        onChange={(e) => setStartingLevel(e.target.value)} 
                        min="0" 
                    />
                    <label className="small-label">Intended Game Length:</label>
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
                    <div className="age-container">
                        <div className="min-age">
                            <label className="small-label">Min Age:</label>
                            <input 
                                type="number" 
                                value={minAge} 
                                onChange={(e) => setMinAge(e.target.value)} 
                                min="0" 
                            />
                        </div>
                        <div className="max-age">
                            <label className="small-label">Max Age:</label>
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
                            <label className="small-label">Min Players:</label>
                            <input 
                                type="number" 
                                value={minPlayers} 
                                onChange={handleMinPlayersChange} 
                                min="1" 
                            />
                        </div>
                        <div className="max-players">
                            <label className="small-label">Max Players:</label>
                            <input 
                                type="number" 
                                value={maxPlayers} 
                                onChange={handleMaxPlayersChange} 
                                min={minPlayers} 
                            />
                        </div>
                    </div>
                    <div className="game-frequency-container">
                        <label className="small-label">Game Frequency:</label>
                        <div className="frequency-inputs">
                            <input 
                                type="number" 
                                value={frequencyNumber} 
                                onChange={handleFrequencyNumberChange} 
                                min="1" 
                                max="9"
                            />
                            <span>per</span>
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

                    <label className="small-label">Game Image:</label>
                    <input 
                        type="file" 
                        onChange={handleImageUpload} 
                    />
                </div>
                <div className="col col-right">
                    <label className="small-label">Game Description:</label>
                    <textarea 
                        value={gameDescription}
                        onChange={(e) => setGameDescription(e.target.value)}
                        style={{ resize: 'none', height: '100%' }}
                    />
                    <button
                        className={"button"}
                        onClick={handleCreateGame}
                    >
                        Create Game
                    </button>
                </div>
            </div>

            {showCropper && (
                <div className="cropper-container">
                    <div className="cropper-wrapper">
                        <Cropper
                            image={gameImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={2 / 1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <div className="cropper-buttons">
                        <button onClick={handleSaveCrop}>Save</button>
                        <button onClick={handleCancelCrop}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGame;
