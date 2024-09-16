// src/components/VisibilitySelector.js

import React from 'react';

const VisibilitySelector = ({ visibility, setVisibility }) => {
  const handleVisibilityChange = (e) => {
    setVisibility(e.target.value);
  };

  return (
    <div className="unified-container">
      <select value={visibility} onChange={handleVisibilityChange}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>
  );
};

export default VisibilitySelector;
