// src/utils/timeUtils.js

export const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourFormatted = hour.toString().padStart(2, '0');
      timeOptions.push(`${hourFormatted}:00`, `${hourFormatted}:30`);
    }
    return timeOptions;
  };
  