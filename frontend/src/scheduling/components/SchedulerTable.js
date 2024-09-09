import React from 'react';

const SchedulerTable = ({ selectedSlots = new Set(), hoveredSlots = new Set(), handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp, days, totalDays, activeMode }) => {
    const timeSlots = Array.from({ length: 48 }, (_, index) => `${Math.floor(index / 2).toString().padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`);

    return (
        <div className="scheduler-table-wrapper">
            <div className="scheduler-background-bar"></div>
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
                        let dayOfWeek, formattedDate;

                        if (!isNaN(new Date(day).getTime())) {
                            const dayDate = new Date(day);
                            dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
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
                                            {formattedDate && <span className="day-date">{formattedDate}</span>}
                                        </div>
                                    </td>
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
