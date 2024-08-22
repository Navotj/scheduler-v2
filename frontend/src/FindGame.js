import React, { useState, useEffect } from 'react';
import GamePreview from './GamePreview';  // Make sure this path is correct
import './styles.css';

const FindGame = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('http://localhost:5000/games/public');
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, []);

    return (
        <div className="find-game-container">
            <h2>Find a Game</h2>
            <div className="game-cards-grid">
                {games.map((game) => (
                    <div key={game._id} className="game-card-wrapper">
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
                            enabledTags={game.enabledTags}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindGame;
