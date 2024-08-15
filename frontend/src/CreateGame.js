import React, { useState } from 'react';

const CreateGame = ({ username }) => {
    const [gameName, setGameName] = useState('');
    const [gameSystem, setGameSystem] = useState('');
    const [intendedPlayerCount, setIntendedPlayerCount] = useState('');
    const [gameModule, setGameModule] = useState('');
    const [language, setLanguage] = useState('');
    const [startingLevel, setStartingLevel] = useState('');
    const [intendedGameLength, setIntendedGameLength] = useState('');
    const [homebrewAvailability, setHomebrewAvailability] = useState(false);
    const [age, setAge] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [gameFrequency, setGameFrequency] = useState('');
    const [publicity, setPublicity] = useState('public');

    const handleCreateGame = async () => {
        const newGame = {
            gameName,
            gameSystem,
            intendedPlayerCount,
            gameModule,
            language,
            startingLevel,
            intendedGameLength,
            homebrewAvailability,
            age,
            maxPlayers,
            gameFrequency,
            publicity,
            owner: username,
            createdAt: new Date().toISOString(),
            players: []
        };

        try {
            const response = await fetch('http://localhost:5000/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGame),
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
        <div>
            <h2>Create Game</h2>
            <input type="text" placeholder="Game Name" value={gameName} onChange={(e) => setGameName(e.target.value)} />
            <input type="text" placeholder="Game System" value={gameSystem} onChange={(e) => setGameSystem(e.target.value)} />
            {/* Add other input fields similar to the above */}
            <button onClick={handleCreateGame}>Create Game</button>
        </div>
    );
};

export default CreateGame;
