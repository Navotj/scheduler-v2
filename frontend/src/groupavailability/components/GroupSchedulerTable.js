// File: src/components/GroupSchedulerTable.js

import React from 'react';

const GroupSchedulerTable = ({
  selectedSlotsCounts = {},
  days,
  usernames = [],
  minPlayers = 1,
  minSessionLength = 1,
}) => {
  console.log('GroupSchedulerTable rendered');
  console.log('selectedSlotsCounts:', selectedSlotsCounts);

  const timeSlots = Array.from({ length: 48 }, (_, index) =>
    `${Math.floor(index / 2).toString().padStart(2, '0')}:${
      index % 2 === 0 ? '00' : '30'
    }`
  );

  const totalPlayers = usernames.length;

  // Generate colors for different concurrency levels
  const colorsByN = {};
  for (let n = minPlayers; n <= totalPlayers; n++) {
    const hue = ((n - minPlayers) / (totalPlayers - minPlayers + 1)) * 120; // Green to red spectrum
    colorsByN[n] = `hsl(${hue}, 100%, 50%)`;
  }

  const processSlotsByConcurrency = () => {
    const slotsByConcurrency = {};

    // Initialize slots for each concurrency level
    for (let n = minPlayers; n <= totalPlayers; n++) {
      slotsByConcurrency[n] = {};
    }

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
        const slotKey = `${dayIndex}-${timeIndex}`;
        const count = selectedSlotsCounts[slotKey] || 0;

        for (let n = minPlayers; n <= totalPlayers; n++) {
          if (count >= n) {
            slotsByConcurrency[n][slotKey] = true;
          }
        }
      }
    }

    return slotsByConcurrency;
  };

  const slotsByConcurrency = processSlotsByConcurrency();

  const processContinuousSlots = () => {
    const slots = {};
    const minSlots = minSessionLength * 2; // Convert hours to half-hour slots

    for (let n = minPlayers; n <= totalPlayers; n++) {
      const concurrencySlots = slotsByConcurrency[n];

      for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
          const slotKey = `${dayIndex}-${timeIndex}`;
          if (!concurrencySlots[slotKey]) continue;

          let length = 0;
          while (
            length < minSlots &&
            timeIndex + length < timeSlots.length &&
            concurrencySlots[`${dayIndex}-${timeIndex + length}`]
          ) {
            length++;
          }

          if (length >= minSlots) {
            for (let l = 0; l < length; l++) {
              slots[`${dayIndex}-${timeIndex + l}`] = {
                concurrency: n,
                color: colorsByN[n],
              };
            }
            timeIndex += length - 1;
          }
        }
      }
    }

    return slots;
  };

  const coloredSlots = processContinuousSlots();

  return (
    <div className="scheduler-table-wrapper">
      <div className="scheduler-background-bar"></div>
      <table className="scheduler-table">
        <thead>
          <tr>
            <th className="scheduler-day-slot"></th>
            {timeSlots.map(
              (time, timeIndex) =>
                time.endsWith(':00') && (
                  <th
                    key={timeIndex}
                    className="scheduler-time-header"
                    colSpan="2"
                  >
                    {parseInt(time.split(':')[0]) + 1}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => {
            let dayOfWeek, formattedDate;

            if (!isNaN(new Date(day).getTime())) {
              const dayDate = new Date(day);
              dayOfWeek = dayDate.toLocaleDateString('en-US', {
                weekday: 'short',
              });
              formattedDate = dayDate.toLocaleDateString();
            } else {
              dayOfWeek = day;
              formattedDate = '';
            }

            const isEndOfWeek = new Date(day).getDay() === 6;

            return (
              <React.Fragment key={dayIndex}>
                <tr className={isEndOfWeek ? 'end-of-week' : ''}>
                  <td className="scheduler-day-slot">
                    <div className="day-wrapper">
                      <span className="day-name">{dayOfWeek}</span>
                      {formattedDate && (
                        <span className="day-date">{formattedDate}</span>
                      )}
                    </div>
                  </td>
                  {timeSlots.map((_, timeIndex) => {
                    const slotKey = `${dayIndex}-${timeIndex}`;
                    const slotInfo = coloredSlots[slotKey];

                    let className = 'time-slot';
                    let style = {};

                    if (slotInfo) {
                      className += ' group-availability-slot';
                      style.backgroundColor = slotInfo.color;
                      style.zIndex = slotInfo.concurrency; // Higher concurrency has higher z-index
                    }

                    return (
                      <td
                        key={timeIndex}
                        className={className}
                        style={style}
                      />
                    );
                  })}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GroupSchedulerTable;
