// src/components/IntendedGameLengthInput.js

import React from 'react';

const IntendedGameLengthInput = ({
  intendedGameLengthMin,
  setIntendedGameLengthMin,
  intendedGameLengthMax,
  setIntendedGameLengthMax,
  intendedGameLengthUnit,
  setIntendedGameLengthUnit,
  gameLengthUnits,
}) => {
  return (
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
        min={intendedGameLengthMin || '1'}
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
  );
};

export default IntendedGameLengthInput;
