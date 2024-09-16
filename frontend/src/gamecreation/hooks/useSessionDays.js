// src/hooks/useSessionDays.js

import { useState } from 'react';

const useSessionDays = () => {
  const [sessionDays, setSessionDays] = useState({
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
  });

  const toggleDay = (day) => {
    setSessionDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  return [sessionDays, toggleDay];
};

export default useSessionDays;
