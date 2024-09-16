// src/components/SessionLengthInput.js

import React from 'react';

const SessionLengthInput = ({
  sessionLengthMin,
  setSessionLengthMin,
  sessionLengthMax,
  setSessionLengthMax,
}) => {
  return (
    <div className="unified-container">
      <input
        type="number"
        value={sessionLengthMin}
        onChange={(e) => setSessionLengthMin(e.target.value)}
        min="1"
        max="24"
      />
      <span>-</span>
      <input
        type="number"
        value={sessionLengthMax}
        onChange={(e) => setSessionLengthMax(e.target.value)}
        min={sessionLengthMin || '1'}
        max="24"
      />
      <button className="static-button">hours</button>
    </div>
  );
};

export default SessionLengthInput;
