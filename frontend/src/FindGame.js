import React, { useState, useEffect } from 'react';

const FindGame = ({ username }) => {
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

    const handleJoinGame = async (gameId) => {
        // Implement join game logic here
    };

    return (
        <div>
            <h2>Find Game</h2>
            <div className="game-list">
                {games.map((game) => (
                    <div key={game.id} className={`game-card ${game.players.length > game.maxPlayers ? 'overfull' : ''}`}>
                        <h3>{game.gameName}</h3>
                        <p>System: {game.gameSystem}</p>
                        <p>Language: {game.language}</p>
                        <p>Players: {game.players.length}/{game.maxPlayers}</p>
                        <button onClick={() => handleJoinGame(game.id)}>Join Game</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindGame;
