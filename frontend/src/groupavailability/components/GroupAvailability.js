// File: src/components/GroupAvailability.js

import React, { useEffect, useState } from 'react';
import GroupSchedulerTable from './GroupSchedulerTable';
import '../styles/groupAvailabilityStyles.css';

const GroupAvailability = ({ availabilities, usernames, minPlayers, minSessionLength }) => {
  const [selectedSlotsCounts, setSelectedSlotsCounts] = useState({});
  const [days, setDays] = useState([]);
  const totalDays = 60;

  useEffect(() => {
    // Generate dates for the next 60 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < totalDays; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      dates.push(nextDay.toLocaleDateString());
    }
    setDays(dates);
  }, []);

  useEffect(() => {
    const processAvailabilities = () => {
      if (!availabilities || availabilities.length === 0 || days.length === 0) {
        console.warn('No availabilities to process.');
        return;
      }

      console.log('Processing availabilities:', availabilities);

      const timeSlots = Array.from({ length: 48 }, (_, index) =>
        `${Math.floor(index / 2).toString().padStart(2, '0')}:${
          index % 2 === 0 ? '00' : '30'
        }`
      );

      const slotCounts = {};

      availabilities.forEach((userAvailability) => {
        userAvailability.times.forEach((timeRange) => {
          const startDate = new Date(timeRange.startDate);
          const endDate = new Date(timeRange.endDate);

          for (
            let time = new Date(startDate);
            time < endDate;
            time.setMinutes(time.getMinutes() + 30)
          ) {
            const dayIndex = Math.floor(
              (time - new Date(days[0])) / (1000 * 60 * 60 * 24)
            );
            if (dayIndex < 0 || dayIndex >= days.length) continue;

            const timeIndex =
              time.getHours() * 2 + (time.getMinutes() >= 30 ? 1 : 0);

            const slotKey = `${dayIndex}-${timeIndex}`;
            slotCounts[slotKey] = (slotCounts[slotKey] || 0) + 1;
          }
        });
      });

      console.log('Selected slots counts:', slotCounts);
      setSelectedSlotsCounts(slotCounts);
    };

    processAvailabilities();
  }, [availabilities, days]);

  return (
    <div className="group-availability-container">
      <GroupSchedulerTable
        days={days}
        usernames={usernames}
        selectedSlotsCounts={selectedSlotsCounts}
        minPlayers={minPlayers}
        minSessionLength={minSessionLength}
      />
    </div>
  );
};

export default GroupAvailability;
