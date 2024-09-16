// src/components/GameSystemSelector.js

import React from 'react';

const GameSystemSelector = ({ gameSystem, setGameSystem, gameSystems }) => {
  return (
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
  );
};

export default GameSystemSelector;
