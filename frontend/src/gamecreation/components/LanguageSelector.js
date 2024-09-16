// src/components/LanguageSelector.js

import React from 'react';

const LanguageSelector = ({ language, setLanguage, languages }) => {
  return (
    <div className="unified-container">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        required
      >
        <option value="" disabled>Select Language</option>
        {languages.map((lang, index) => (
          <option key={index} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
