// File: src/components/GroupSchedulerTable.js

import React, { useMemo } from 'react';

const GroupSchedulerTable = React.memo(({
  selectedSlotsCounts = {},
  days,
  usernames = [],
  minPlayers = 1,
  minSessionLength = 1,
}) => {

  const timeSlots = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) =>
        `${Math.floor(index / 2)
          .toString()
          .padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`
      ),
    []
  );

  const totalPlayers = usernames.length;

  // Memoize colorsByN
  const colorsByN = useMemo(() => {
    const colors = {};
    for (let n = minPlayers; n <= totalPlayers; n++) {
      const lightness =
        ((n - minPlayers) / (totalPlayers - minPlayers || 1)) * 30 + 20; // Lightness from 20% to 50%
      colors[n] = `hsl(120, 100%, ${lightness}%)`; // Hue fixed at 120 for green
    }
    return colors;
  }, [minPlayers, totalPlayers]);

  // Memoize slotsByConcurrency
  const slotsByConcurrency = useMemo(() => {
    const slots = {};

    for (let n = minPlayers; n <= totalPlayers; n++) {
      slots[n] = {};
    }

    for (let slotKey in selectedSlotsCounts) {
      const count = selectedSlotsCounts[slotKey];
      for (let n = minPlayers; n <= totalPlayers; n++) {
        if (count >= n) {
          slots[n][slotKey] = true;
        }
      }
    }

    return slots;
  }, [selectedSlotsCounts, minPlayers, totalPlayers]);

  // Memoize coloredSlots
  const coloredSlots = useMemo(() => {
    const slots = {};
    const minSlots = minSessionLength * 2; // Convert hours to half-hour slots

    for (let n = minPlayers; n <= totalPlayers; n++) {
      const concurrencySlots = slotsByConcurrency[n];

      for (let slotKey in concurrencySlots) {
        const [dayIndexStr, timeIndexStr] = slotKey.split('-');
        const dayIndex = parseInt(dayIndexStr, 10);
        let timeIndex = parseInt(timeIndexStr, 10);

        let length = 0;
        while (
          length < minSlots &&
          concurrencySlots[`${dayIndex}-${timeIndex + length}`]
        ) {
          length++;
        }

        if (length >= minSlots) {
          for (let l = 0; l < length; l++) {
            const key = `${dayIndex}-${timeIndex + l}`;
            slots[key] = {
              concurrency: n,
              color: colorsByN[n],
            };
          }
        }
      }
    }

    return slots;
  }, [slotsByConcurrency, minPlayers, totalPlayers, minSessionLength, colorsByN]);

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
                    {parseInt(time.split(':')[0], 10) + 1}
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
});

export default GroupSchedulerTable;
