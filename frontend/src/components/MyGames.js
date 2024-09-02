import React, { useState, useEffect } from 'react';
import GamePreview from './GamePreview'; // Import the regular GamePreview component
import '../styles/Games.css';

const MyGames = ({ username }) => {
    const [games, setGames] = useState([]);
    
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

    return (
        <div className="my-games-container">
            <div className="game-cards-grid"> {/* Use the same class for layout */}
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
                            sessionLengthMin={game.sessionLengthMin}
                            sessionLengthMax={game.sessionLengthMax}
                            sessionDays={game.sessionDays}
                            minAge={game.minAge}
                            maxAge={game.maxAge}
                            startingLevel={game.startingLevel}
                            location={game.location}
                            startHour={game.startHour}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyGames;
