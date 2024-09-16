// src/components/PlayerCountInput.js

import React from 'react';

const PlayerCountInput = ({ minPlayers, setMinPlayers, maxPlayers, setMaxPlayers }) => {
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

  return (
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
  );
};

export default PlayerCountInput;
