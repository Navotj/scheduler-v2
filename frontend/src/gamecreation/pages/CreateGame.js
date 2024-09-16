import React, { useState, useRef, useEffect } from 'react';
import '../styles/CreateGame.css';
import TagsManager from '../components/TagsManager';
import moment from 'moment-timezone';

// Import components
import BannerImageCropper from '../components/BannerImageCropper';
import SessionDaysSelector from '../components/SessionDaysSelector';
import LocationSelector from '../components/LocationSelector';
import GameSystemSelector from '../components/GameSystemSelector';
import LanguageSelector from '../components/LanguageSelector';
import PlayerCountInput from '../components/PlayerCountInput';
import IntendedGameLengthInput from '../components/IntendedGameLengthInput';
import SessionLengthInput from '../components/SessionLengthInput';
import StartHourSelector from '../components/StartHourSelector';
import AgeRangeInput from '../components/AgeRangeInput';
import VisibilitySelector from '../components/VisibilitySelector';
import BannerUpload from '../components/BannerUpload';
import GamePreview from '../../components/GamePreview'; // Import GamePreview component

// Import hooks and utilities
import useSessionDays from '../hooks/useSessionDays';
import { gameSystems, languages, gameLengthUnits } from '../data/constants';
import { generateTimeOptions } from '../utils/timeUtils';

const CreateGame = ({ username }) => {
  // State variables
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [gameName, setGameName] = useState('');
  const [gameSystem, setGameSystem] = useState('');
  const [language, setLanguage] = useState('');
  const [intendedGameLengthMin, setIntendedGameLengthMin] = useState('');
  const [intendedGameLengthMax, setIntendedGameLengthMax] = useState('');
  const [intendedGameLengthUnit, setIntendedGameLengthUnit] = useState('session');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [croppedImage, setCroppedImage] = useState(null);
  const [enabledTags, setEnabledTags] = useState([]);
  const [sessionLengthMin, setSessionLengthMin] = useState('');
  const [sessionLengthMax, setSessionLengthMax] = useState('');
  const [sessionDays, toggleDay] = useSessionDays();
  const [visibility, setVisibility] = useState('public');
  const [bannerImage, setBannerImage] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startHour, setStartHour] = useState('');

  // Additional state variables for GamePreview
  const frequencyNumber = 1;
  const frequencyInterval = 1;
  const frequencyTimeFrame = 'week';
  const startingLevel = 1;

  // User's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Time options
  const timeOptions = generateTimeOptions();

  // Refs and state for game preview scaling
  const [gamePreviewScale, setGamePreviewScale] = useState(1);
  const gamePreviewWrapperRef = useRef(null);

  // Handlers
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGame = async () => {
    // Validation can be enhanced based on requirements
    if (!gameName || !gameSystem || !language || !username || !selectedLocation) {
      alert('Please fill in all required fields, including the location and start hour.');
      return;
    }

    // Convert startHour to a UTC date object
    const startHourUTC = moment.tz(startHour, 'HH:mm', userTimezone).utc().toDate();

    const formData = {
      gameName,
      gameSystem,
      language,
      intendedGameLengthMin,
      intendedGameLengthMax,
      intendedGameLengthUnit,
      minAge,
      maxAge,
      minPlayers,
      maxPlayers,
      gameDescription,
      gameImage: croppedImage || '',
      enabledTags: enabledTags.length > 0 ? JSON.stringify(enabledTags) : '[]',
      owner: username,
      visibility,
      location: selectedLocation,
      startHour: startHourUTC,
      sessionLengthMin,
      sessionLengthMax,
      sessionDays: Object.keys(sessionDays).map((day) => ({
        day,
        available: sessionDays[day],
      })),
    };

    try {
      const response = await fetch('http://localhost:5000/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Navigation handlers
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  // UseEffect to calculate game preview scale based on wrapper size
  useEffect(() => {
    const calculateScale = () => {
      if (gamePreviewWrapperRef.current) {
        const wrapperWidth = gamePreviewWrapperRef.current.offsetWidth;
        const wrapperHeight = gamePreviewWrapperRef.current.offsetHeight;
        const componentWidth = 400; // Adjust to your GamePreview's width
        const componentHeight = 600; // Adjust to your GamePreview's height
        const scaleX = wrapperWidth / componentWidth;
        const scaleY = wrapperHeight / componentHeight;
        const scale = Math.min(scaleX, scaleY);

        setGamePreviewScale(scale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [currentStep]);

  return (
    <div className="create-game-container">
      <div className="form-content">
        {/* Step Content */}
        {currentStep === 1 && (
          <div className="form-step">
            {/* Table Information */}
            <h2>Table Information</h2>

            <div className="table-info-grid">
              <div className="left-column">
                {/* Game Title */}
                <label className="small-label">
                  Game Title:<span style={{ color: 'red' }}>*</span>
                </label>
                <div className="input-container">
                  <input
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    required
                  />
                </div>

                {/* Location */}
                <label className="small-label">
                  Location: <span style={{ color: 'red' }}>*</span>
                </label>
                <div className="input-container">
                  <LocationSelector
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                  />
                </div>

                {/* Intended Game Length */}
                <label className="small-label">Intended Game Length:</label>
                <div className="input-container">
                  <IntendedGameLengthInput
                    intendedGameLengthMin={intendedGameLengthMin}
                    setIntendedGameLengthMin={setIntendedGameLengthMin}
                    intendedGameLengthMax={intendedGameLengthMax}
                    setIntendedGameLengthMax={setIntendedGameLengthMax}
                    intendedGameLengthUnit={intendedGameLengthUnit}
                    setIntendedGameLengthUnit={setIntendedGameLengthUnit}
                    gameLengthUnits={gameLengthUnits}
                  />
                </div>
              </div>

              <div className="right-column">
                {/* Language */}
                <label className="small-label">
                  Language:<span style={{ color: 'red' }}>*</span>
                </label>
                <div className="input-container">
                  <LanguageSelector
                    language={language}
                    setLanguage={setLanguage}
                    languages={languages}
                  />
                </div>

                {/* Player Count */}
                <label className="small-label">Player Count:</label>
                <div className="input-container">
                  <PlayerCountInput
                    minPlayers={minPlayers}
                    setMinPlayers={setMinPlayers}
                    maxPlayers={maxPlayers}
                    setMaxPlayers={setMaxPlayers}
                  />
                </div>

                {/* Age Range */}
                <label className="small-label">Age Range:</label>
                <div className="input-container">
                  <AgeRangeInput
                    minAge={minAge}
                    setMinAge={setMinAge}
                    maxAge={maxAge}
                    setMaxAge={setMaxAge}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            {/* Game Information */}
            <h2>Game Information</h2>

            <div className="game-info-grid">
              <div className="left-column">
                {/* Game System */}
                <label className="small-label">
                  Game System:<span style={{ color: 'red' }}>*</span>
                </label>
                <div className="input-container">
                  <GameSystemSelector
                    gameSystem={gameSystem}
                    setGameSystem={setGameSystem}
                    gameSystems={gameSystems}
                  />
                </div>

                {/* Tags Manager */}
                <div className="input-container">
                  <TagsManager
                    enabledTags={enabledTags}
                    setEnabledTags={setEnabledTags}
                    minAge={minAge}
                  />
                </div>
              </div>
              <div className="right-column">
                {/* Game Description */}
                <label className="small-label">Game Description:</label>
                <div className="input-container">
                  <textarea
                    value={gameDescription}
                    onChange={(e) => setGameDescription(e.target.value)}
                    className="game-description-textarea"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            {/* Schedule Information */}
            <h2>Schedule Information</h2>

            {/* Session Days */}
            <label className="small-label">Possible Session Day/s:</label>
            <div className="input-container">
              <SessionDaysSelector sessionDays={sessionDays} toggleDay={toggleDay} />
            </div>

            {/* Session Length */}
            <label className="small-label">Session Length:</label>
            <div className="input-container">
              <SessionLengthInput
                sessionLengthMin={sessionLengthMin}
                setSessionLengthMin={setSessionLengthMin}
                sessionLengthMax={sessionLengthMax}
                setSessionLengthMax={setSessionLengthMax}
              />
            </div>

            {/* Start Hour */}
            <label className="small-label">Start Hour:</label>
            <div className="input-container">
              <StartHourSelector
                startHour={startHour}
                setStartHour={setStartHour}
                timeOptions={timeOptions}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step">
            {/* Additional Information */}
            <h2>Additional Information</h2>

            <div className="additional-info-grid">
              <div className="left-column">
                {/* Banner Upload */}
                <label className="small-label">Banner:</label>
                <div className="input-container">
                  <BannerUpload
                    handleBannerUpload={handleBannerUpload}
                    croppedImage={croppedImage}
                  />
                </div>

                {/* Visibility */}
                <label className="small-label">Visibility:</label>
                <div className="input-container">
                  <VisibilitySelector visibility={visibility} setVisibility={setVisibility} />
                </div>
              </div>

              <div className="right-column">
                {/* Game Preview */}
                <div className="game-preview-wrapper" ref={gamePreviewWrapperRef}>
                    <GamePreview
                      username={username}
                      gameName={gameName}
                      gameSystem={gameSystem}
                      language={language}
                      frequencyNumber={frequencyNumber}
                      frequencyInterval={frequencyInterval}
                      frequencyTimeFrame={frequencyTimeFrame}
                      intendedGameLengthMin={intendedGameLengthMin}
                      intendedGameLengthMax={intendedGameLengthMax}
                      intendedGameLengthUnit={intendedGameLengthUnit}
                      minPlayers={minPlayers}
                      maxPlayers={maxPlayers}
                      minAge={minAge}
                      maxAge={maxAge}
                      croppedImage={croppedImage}
                      gameDescription={gameDescription}
                      enabledTags={enabledTags}
                      sessionLengthMin={sessionLengthMin}
                      sessionLengthMax={sessionLengthMax}
                      sessionDays={Object.keys(sessionDays).map((day) => ({
                        day,
                        available: sessionDays[day],
                      }))}
                      startingLevel={startingLevel}
                      location={selectedLocation}
                      startHour={startHour}
                    />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner Image Cropper */}
        {bannerImage && (
          <BannerImageCropper
            bannerImage={bannerImage}
            setBannerImage={setBannerImage}
            setCroppedImage={setCroppedImage}
          />
        )}
      </div>

      <div className="buttons-container">
        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button className="nav-button" onClick={prevStep} disabled={currentStep === 1}>
            &lt;
          </button>
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              className={`nav-button ${currentStep === step ? 'active' : ''}`}
              onClick={() => goToStep(step)}
            >
              {step}
            </button>
          ))}
          {currentStep < totalSteps && (
            <button className="nav-button" onClick={nextStep}>
              &gt;
            </button>
          )}
          {currentStep === totalSteps && (
            <button className="nav-button" onClick={handleCreateGame}>
              Fin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
