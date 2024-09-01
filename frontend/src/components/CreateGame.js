import React, { useState } from 'react';
import '../styles/CreateGame.css';
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
    const [sessionLengthMin, setSessionLengthMin] = useState('');
    const [sessionLengthMax, setSessionLengthMax] = useState('');
    const [sessionDays, setSessionDays] = useState({
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
    });

    const [visibility, setVisibility] = useState('public');
    const [bannerImage, setBannerImage] = useState(null); // New state for banner image

    const handleVisibilityChange = (e) => {
        setVisibility(e.target.value);
    };

    const toggleDay = (day) => {
        setSessionDays(prevDays => ({
            ...prevDays,
            [day]: !prevDays[day],
        }));
    };

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
        'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Bengali', 'Bulgarian', 'Burmese', 
        'Cantonese', 'Catalan', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Finnish', 
        'French', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Hausa', 'Hebrew', 'Hindi', 'Hungarian', 
        'Icelandic', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Kannada', 'Kazakh', 'Khmer', 'Korean', 'Kyrgyz', 
        'Lao', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malay', 'Malayalam', 'Maltese', 'Mandarin', 
        'Marathi', 'Mongolian', 'Nepali', 'Norwegian', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 
        'Russian', 'Scots Gaelic', 'Serbian', 'Sinhalese', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Swahili', 'Swedish', 
        'Tagalog', 'Tajik', 'Tamil', 'Telugu', 'Thai', 'Tibetan', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 'Uzbek', 
        'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish', 'Zulu'
    ];

    const timeFrames = ['day', 'week', 'month'];
    const gameLengthUnits = ['session', 'day', 'week', 'month', 'year'];

    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBannerImage(reader.result);
                setShowCropper(true); // Show cropper after upload
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelCrop = () => {
        setShowCropper(false);
        setBannerImage(null); // Reset the banner image if canceled
    };

    const handleSaveCrop = () => {
        if (!cropArea || !bannerImage) return;
    
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.src = bannerImage;
        image.onload = () => {
            const aspectRatio = 3 / 1;
            const newWidth = 150; // Compress to 300 pixels wide
            const newHeight = newWidth / aspectRatio;
            canvas.width = newWidth;
            canvas.height = newHeight;
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
            const base64Image = canvas.toDataURL('image/jpeg'); // Convert to Base64 string
            setCroppedImage(base64Image);
            setShowCropper(false); // Hide cropper after cropping
        };
    };
    

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCropArea(croppedAreaPixels);
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
    
        const formData = {
            gameName,
            gameSystem,
            language,
            startingLevel,
            intendedGameLengthMin,
            intendedGameLengthMax,
            intendedGameLengthUnit,
            minAge,
            maxAge,
            minPlayers,
            maxPlayers,
            frequencyNumber,
            frequencyInterval,
            frequencyTimeFrame,
            gameDescription,
            gameImage: croppedImage || "",  // Ensure it's a string or empty string if undefined
            enabledTags: enabledTags.length > 0 ? JSON.stringify(enabledTags) : "[]",  // Stringify or default to an empty array
            owner: username,
            visibility,
            sessionLengthMin,
            sessionLengthMax,
            sessionDays,  // Include the sessionDays in the form data
        };

        console.log('Form Data:', formData);  // Log formData to check sessionDays content
    
        try {
            const response = await fetch('http://localhost:5000/games/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                alert('Game created successfully!');
            } else {
                const errorData = await response.json();
                console.error('Failed to create game:', errorData);
                alert('Failed to create game.');
            }
        } catch (error) {
            console.error('Error creating game:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    


    return (
        <div className="create-game-container">
            <div className="form-grid-three-cols">
                <div className="col">
                    <label className="small-label">Game Title:</label>
                    <div className="unified-container">
                        <input
                            type="text"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            required
                        />
                    </div>
                    <label className="small-label">Game System:</label>
                    <div className="unified-container">
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
                    </div>
                    <label className="small-label">Language:</label>
                    <div className="unified-container">
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
                    <label className="small-label">Starting Level:</label>
                    <div className="unified-container">
                        <input
                            type="number"
                            value={startingLevel}
                            onChange={(e) => setStartingLevel(e.target.value)}
                            min="0"
                        />
                    </div>
                    <label className="small-label">Age Range:</label>
                    <div className="unified-container">
                        <div>
                            <input
                                type="number"
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                                min="0"
                            />
                        </div>
                        <span>-</span>
                        <div>
                            <input
                                type="number"
                                value={maxAge}
                                onChange={(e) => setMaxAge(e.target.value)}
                                min={minAge || "0"}
                            />
                        </div>
                    </div>
                    <label className="small-label">Player Count:</label>
                    <div className="unified-container">
                        <div>
                            <input
                                type="number"
                                value={minPlayers}
                                onChange={handleMinPlayersChange}
                                min="1"
                            />
                        </div>
                        <span>-</span>
                        <div>
                            <input
                                type="number"
                                value={maxPlayers}
                                onChange={handleMaxPlayersChange}
                                min={minPlayers}
                            />
                        </div>
                    </div>

                    <label className="small-label">Visibility:</label>
                    <div className="unified-container">
                        <select
                            value={visibility}
                            onChange={handleVisibilityChange}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    
                    <label className="small-label">Banner:</label>
                    <div className="unified-container">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="banner-upload"
                        />
                    </div>
                    {croppedImage && (
                        <div className="banner-image-container">
                            <img src={croppedImage} alt="Cropped Banner" className="banner-image" />
                        </div>
                    )}
                </div>

                <div className="col">
                    <label className="small-label">Intended Game Length:</label>
                    <div className="unified-container">
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
                    <label className="small-label">Game Frequency:</label>
                    <div className="unified-container">
                        <input
                            type="number"
                            value={frequencyNumber}
                            onChange={(e) => setFrequencyNumber(e.target.value)}
                            min="1"
                            max="9"
                        />
                        <span>per</span>
                        <input
                            type="number"
                            value={frequencyInterval}
                            onChange={(e) => setFrequencyInterval(e.target.value)}
                            disabled={frequencyNumber > 1}
                            min="1"
                            max="9"
                            style={{ backgroundColor: frequencyNumber > 1 ? '#333' : '#1e1e1e' }}
                        />
                        <select
                            value={frequencyTimeFrame}
                            onChange={(e) => setFrequencyTimeFrame(e.target.value)}
                        >
                            {timeFrames.map((frame, index) => (
                                <option key={index} value={frame}>
                                    {frame}{frequencyInterval > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <label className="small-label">Session Length:</label>
                    <div className="unified-container">
                        <input
                            type="number"
                            value={sessionLengthMin}
                            onChange={(e) => setSessionLengthMin(e.target.value)}
                            min="1"
                            max="24"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={sessionLengthMax}
                            onChange={(e) => setSessionLengthMax(e.target.value)}
                            min={sessionLengthMin || "1"}
                            max="24"
                        />
                        <button className="static-button">hours</button>
                    </div>
                    <label className="small-label">Possible Session Day/s:</label>
                    <div className="unified-container days-buttons">
                        {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day) => (
                            <button
                                key={day}
                                className={sessionDays[day] ? "day-button active" : "day-button"}
                                onClick={() => toggleDay(day)}
                            >
                                {day.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <div className="tags-wrapper">
                        <TagsManager
                            enabledTags={enabledTags}
                            setEnabledTags={setEnabledTags}
                            minAge={minAge}
                        />
                    </div>
                </div>

                <div className="col">
                    <label className="small-label">Game Description:</label>
                    <textarea
                        value={gameDescription}
                        onChange={(e) => setGameDescription(e.target.value)}
                    />
                    <button
                        className="button"
                        onClick={handleCreateGame}
                    >
                        Create Game
                    </button>


                </div>

                {showCropper && (
                    <div className="cropper-container">
                        <div className="cropper-wrapper">
                            <Cropper
                                image={bannerImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 1} // 3:1 aspect ratio
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
        </div>
    );
};

export default CreateGame;
