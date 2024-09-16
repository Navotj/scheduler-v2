// src/components/AgeRangeInput.js

import React from 'react';

const AgeRangeInput = ({ minAge, setMinAge, maxAge, setMaxAge }) => {
  return (
    <div className="unified-container">
      <div>
        <input
          type="number"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          min="0"
        />
      </div>
      <span>-</span>
      <div>
        <input
          type="number"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          min={minAge || '0'}
        />
      </div>
    </div>
  );
};

export default AgeRangeInput;
