// src/components/SessionDaysSelector.js

import React from 'react';

const SessionDaysSelector = ({ sessionDays, toggleDay }) => {
  return (
    <div className="unified-container days-buttons">
      {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
        <button
          key={day}
          className={sessionDays[day] ? 'day-button active' : 'day-button'}
          onClick={() => toggleDay(day)}
        >
          {day.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default SessionDaysSelector;
