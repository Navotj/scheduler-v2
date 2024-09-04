import React from 'react';

const SchedulerTable = ({ selectedSlots = new Set(), hoveredSlots = new Set(), handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp, days, totalDays, activeMode }) => {
    const timeSlots = Array.from({ length: 48 }, (_, index) => `${Math.floor(index / 2).toString().padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`);

    return (
        <div className="scheduler-table-wrapper">
            <table className="scheduler-table">
                <thead>
                    <tr>
                        <th className="scheduler-day-slot"></th>
                        {timeSlots.map((time, timeIndex) => time.endsWith(":00") && (
                            <th key={timeIndex} className="scheduler-time-header" colSpan="2">
                                {parseInt(time.split(':')[0]) + 1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map((day, dayIndex) => {
                        const dayDate = new Date(day);
                        const isEndOfWeek = dayDate.getDay() === 6;  // Saturday is day 6

                        return (
                            <React.Fragment key={dayIndex}>
                                <tr className={isEndOfWeek ? 'end-of-week' : ''}>
                                    <td className="scheduler-day-slot">{day}</td>
                                    {timeSlots.map((_, timeIndex) => {
                                        const slotKey = `${dayIndex}-${timeIndex}`;
                                        const isSelected = selectedSlots.has(slotKey);
                                        const isHovered = hoveredSlots.has(slotKey);

                                        return (
                                            <td
                                                key={timeIndex}
                                                className={`time-slot ${isSelected ? 'selected-slot' : ''} ${isHovered ? 'hovered-slot' : ''}`}
                                                onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                                onMouseOver={() => handleMouseOver(dayIndex, timeIndex)}
                                                onMouseUp={handleMouseUp}
                                                onClick={() => handleSlotClick(dayIndex, timeIndex)}
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

export default SchedulerTable;
