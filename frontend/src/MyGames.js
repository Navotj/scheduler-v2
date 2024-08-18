import React, { useState, useEffect } from 'react';
import GamePreview from './GamePreview'; // Import the regular GamePreview component
import './styles.css';

const MyGames = ({ username }) => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchMyGames = async () => {
            try {
                const response = await fetch(`http://localhost:5000/games/user/${username}`);
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchMyGames();
    }, [username]);

    const handleGameClick = (game) => {
        setSelectedGame(game);
        setIsEditing(false); // Ensure the game starts in a non-editable state
    };

    const handleEditClick = () => {
        setIsEditing(true); // Enable editing
    };

    const handleUpdateGame = async () => {
        if (!selectedGame) return;

        try {
            const response = await fetch(`http://localhost:5000/games/${selectedGame._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedGame),
            });

            if (response.ok) {
                alert('Game updated successfully!');
                setIsEditing(false); // Disable editing after saving
            } else {
                alert('Failed to update game.');
            }
        } catch (error) {
            console.error('Error updating game:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedGame({
            ...selectedGame,
            [name]: value,
        });
    };

    if (selectedGame) {
        return (
            <div className="form-container">
                <h2>{isEditing ? 'Edit Game' : 'Game Details'}</h2>
                <div className="form-grid-four-cols">
                    <div className="col col-left">
                        <label>Game Title:</label>
                        <input 
                            type="text"
                            name="gameName"
                            value={selectedGame.gameName} 
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <label>Game System:</label>
                        <select 
                            name="gameSystem"
                            value={selectedGame.gameSystem} 
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            {/* Add the options for game systems here */}
                        </select>
                        <label>Language:</label>
                        <select 
                            name="language"
                            value={selectedGame.language} 
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            {/* Add the options for languages here */}
                        </select>
                        {/* Add other fields similarly */}
                    </div>
                    <div className="col col-middle">
                        {/* Add more fields similarly */}
                    </div>
                    <div className="col col-right">
                        <label>Game Description:</label>
                        <textarea 
                            name="gameDescription"
                            value={selectedGame.gameDescription}
                            onChange={handleChange}
                            style={{ resize: 'none', height: '100%' }}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col col-preview">
                        <label>Preview:</label>
                        <GamePreview
                            username={selectedGame.owner}
                            gameName={selectedGame.gameName}
                            gameSystem={selectedGame.gameSystem}
                            language={selectedGame.language}
                            frequencyNumber={selectedGame.frequencyNumber}
                            frequencyInterval={selectedGame.frequencyInterval}
                            frequencyTimeFrame={selectedGame.frequencyTimeFrame}
                            intendedGameLengthMin={selectedGame.intendedGameLengthMin}
                            intendedGameLengthMax={selectedGame.intendedGameLengthMax}
                            intendedGameLengthUnit={selectedGame.intendedGameLengthUnit}
                            minPlayers={selectedGame.minPlayers}
                            maxPlayers={selectedGame.maxPlayers}
                            croppedImage={selectedGame.gameImage}
                        />
                        {isEditing ? (
                            <button 
                                className="create-button" 
                                onClick={handleUpdateGame}
                                style={{ marginTop: '20px' }}
                            >
                                Update Game
                            </button>
                        ) : (
                            <button 
                                className="create-button" 
                                onClick={handleEditClick}
                                style={{ marginTop: '20px' }}
                            >
                                Edit Game
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">  {/* Add the form-container class here */}
            <div className="game-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {games.map((game) => (
                    <div 
                        key={game._id} 
                        className="game-card" 
                        style={{ width: '48%', transform: 'scale(0.65)', transformOrigin: 'top left' }}  // Ensure two cards fit per row
                        onClick={() => handleGameClick(game)}
                    >
                        <GamePreview
                            username={game.owner}
                            gameName={game.gameName}
                            gameSystem={game.gameSystem}
                            language={game.language}
                            frequencyNumber={game.frequencyNumber}
                            frequencyInterval={game.frequencyInterval}
                            frequencyTimeFrame={game.frequencyTimeFrame}
                            intendedGameLengthMin={game.intendedGameLengthMin}
                            intendedGameLengthMax={game.intendedGameLengthMax}
                            intendedGameLengthUnit={game.intendedGameLengthUnit}
                            minPlayers={game.minPlayers}
                            maxPlayers={game.maxPlayers}
                            croppedImage={game.gameImage}
                            gameDescription={game.gameDescription}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyGames;
