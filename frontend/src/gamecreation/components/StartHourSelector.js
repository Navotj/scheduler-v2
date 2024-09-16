// src/components/StartHourSelector.js

import React from 'react';

const StartHourSelector = ({ startHour, setStartHour, timeOptions }) => {
  return (
    <div className="unified-container">
      <select
        value={startHour}
        onChange={(e) => setStartHour(e.target.value)}
        required
      >
        <option value="" disabled>Select Start Hour</option>
        {timeOptions.map((time, index) => (
          <option key={index} value={time}>{time}</option>
        ))}
      </select>
    </div>
  );
};

export default StartHourSelector;
