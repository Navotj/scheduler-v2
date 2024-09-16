// src/components/LocationSelector.js

import React from 'react';

const LocationSelector = ({ selectedLocation, setSelectedLocation }) => {
  return (
    <div className="unified-container">
      {['Online', 'In-person', 'Play-by-post'].map((location) => (
        <button
          key={location}
          className={`location-button ${selectedLocation === location ? 'active' : ''}`}
          onClick={() => setSelectedLocation(location)}
        >
          {location}
        </button>
      ))}
    </div>
  );
};

export default LocationSelector;
