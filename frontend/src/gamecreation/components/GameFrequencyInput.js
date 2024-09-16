// src/components/GameFrequencyInput.js

import React from 'react';

const GameFrequencyInput = ({
  frequencyNumber,
  setFrequencyNumber,
  frequencyInterval,
  setFrequencyInterval,
  frequencyTimeFrame,
  setFrequencyTimeFrame,
  timeFrames,
}) => {
  const handleFrequencyNumberChange = (e) => {
    const value = e.target.value;
    setFrequencyNumber(value);

    // Reset the frequencyInterval to "1" if the frequencyNumber is changed from "1"
    if (value !== '1') {
      setFrequencyInterval('1');
    }
  };

  return (
    <div className="unified-container">
      <input
        type="number"
        value={frequencyNumber}
        onChange={handleFrequencyNumberChange}
        min="1"
        max="9"
      />
      <span>per</span>
      <input
        type="number"
        value={frequencyInterval}
        onChange={(e) => setFrequencyInterval(e.target.value)}
        disabled={frequencyNumber > 1}
        min="1"
        max="9"
        style={{ backgroundColor: frequencyNumber > 1 ? '#333' : '#1e1e1e' }}
      />
      <select
        value={frequencyTimeFrame}
        onChange={(e) => setFrequencyTimeFrame(e.target.value)}
      >
        {timeFrames.map((frame, index) => (
          <option key={index} value={frame}>
            {frame}{frequencyInterval > 1 ? 's' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GameFrequencyInput;
