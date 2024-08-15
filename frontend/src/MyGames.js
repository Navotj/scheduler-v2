import React, { useState, useEffect } from 'react';

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
        <div>
            <h2>My Games</h2>
            <div className="game-list">
                {games.map((game) => (
                    <div key={game.id} className="game-card">
                        <h3>{game.gameName}</h3>
                        <p>System: {game.gameSystem}</p>
                        <p>Language: {game.language}</p>
                        <p>Players: {game.players.length}/{game.maxPlayers}</p>
                        <p>{game.owner === username ? 'GM' : 'Player'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyGames;
