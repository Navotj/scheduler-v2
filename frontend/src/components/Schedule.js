import React, { useState, useRef, useCallback } from 'react';
import '../styles/Schedule.css';

const Schedule = ({ username, onAvailabilitySubmit }) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [isAddMode, setIsAddMode] = useState(true);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const scheduleTableRef = useRef(null);

    const intervalMinutes = 30;
    const totalDays = 60; // 60 days for 2 months

    const generateTimeSlots = () => {
        let slots = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += intervalMinutes) {
                slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const toggleMode = () => {
        setIsAddMode(!isAddMode);
    };

    const handleMouseDown = (dayIndex, timeIndex) => {
        setDragging(true);
        setDragStart({ dayIndex, timeIndex });
        setDragEnd({ dayIndex, timeIndex });
    };

    const handleMouseOver = (dayIndex, timeIndex) => {
        if (dragging) {
            setDragEnd({ dayIndex, timeIndex });
        }
    };

    const handleMouseUp = () => {
        if (dragging) {
            applyDragSelection();
            setDragging(false);
            setDragStart(null);
            setDragEnd(null);
        }
    };

    const handleMouseLeave = () => {
        if (dragging) {
            setDragging(false);
            setDragStart(null);
            setDragEnd(null);
        }
    };

    const applyDragSelection = useCallback(() => {
        if (!dragStart || !dragEnd) return;

        const startDayIndex = Math.min(dragStart.dayIndex, dragEnd.dayIndex);
        const endDayIndex = Math.max(dragStart.dayIndex, dragEnd.dayIndex);

        const startTimeIndex = Math.min(dragStart.timeIndex, dragEnd.timeIndex);
        const endTimeIndex = Math.max(dragStart.timeIndex, dragEnd.timeIndex);

        const newSlots = new Set(selectedSlots);

        for (let day = startDayIndex; day <= endDayIndex; day++) {
            for (let time = startTimeIndex; time <= endTimeIndex; time++) {
                const slot = generateSlot(day, time);
                if (isAddMode) {
                    newSlots.add(slot);
                } else {
                    newSlots.delete(slot);
                }
            }
        }

        setSelectedSlots(newSlots);
    }, [dragStart, dragEnd, selectedSlots, isAddMode]);

    const generateSlot = (dayIndex, timeIndex) => {
        const dayOffset = new Date();
        dayOffset.setDate(dayOffset.getDate() + dayIndex);

        const time = timeSlots[timeIndex];
        const [hours, minutes] = time.split(':').map(Number);
        const startTime = new Date(dayOffset);
        startTime.setHours(hours, minutes, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + intervalMinutes);

        return `${startTime.toISOString()}-${endTime.toISOString()}`;
    };

    const handleSave = () => {
        const payload = {
            username,
            times: Array.from(selectedSlots).map(slot => {
                const [startDate, endDate] = slot.split('-');
                return { startDate, endDate };
            }),
        };
        console.log('Submitting:', payload);
        onAvailabilitySubmit(payload);
    };

    return (
        <div className="scheduler-container" onMouseLeave={handleMouseLeave}>
            <div className="scheduler-table-wrapper" ref={scheduleTableRef}>
                <table className="scheduler-table" onMouseUp={handleMouseUp}>
                <thead>
                    <tr>
                        <th className="scheduler-day-slot"></th> {/* Empty first cell for date labels */}
                        {timeSlots.map((time, timeIndex) => {
                            if (time.endsWith(":00")) { // Check if the time is on the hour
                                let hour = time.split(':')[0]; // Get only the hour part
                                hour = hour.startsWith('0') ? hour.substring(1) : hour; // Remove leading zero if present
                                return (
                                    <th key={timeIndex} className="scheduler-time-header" colSpan="2">
                                        {hour}
                                    </th>
                                );
                            }
                            return null; // Skip the :30 time slots
                        })}
                    </tr>
                </thead>



                <tbody>
                    {Array.from({ length: totalDays }).map((_, dayIndex) => {
                        const currentDay = new Date();
                        currentDay.setDate(currentDay.getDate() + dayIndex);
                        const dayOfWeek = currentDay.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
                        const isEndOfWeek = dayOfWeek === 6; // Saturday is the end of the week

                        return (
                            <tr key={dayIndex}>
                                <td className={`scheduler-day-slot ${isEndOfWeek ? 'end-of-week' : ''}`}>
                                    {currentDay.toLocaleDateString('en-US', { weekday: 'short' })} <br /> {currentDay.toLocaleDateString()}
                                </td>
                                {timeSlots.map((time, timeIndex) => (
                                    <td
                                        key={timeIndex}
                                        className={`time-slot ${isEndOfWeek ? 'end-of-week-border' : ''} ${selectedSlots.has(generateSlot(dayIndex, timeIndex)) ? 'selected-slot' : ''}`}
                                        onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                        onMouseOver={() => handleMouseOver(dayIndex, timeIndex)}
                                    />
                                ))}
                            </tr>
                        );
                    })}
                </tbody>




                </table>
            </div>
            <div className="action-buttons">
                <button
                    className={isAddMode ? 'active' : ''}
                    onClick={toggleMode}
                >+</button>
                <button
                    className={!isAddMode ? 'active' : ''}
                    onClick={toggleMode}
                >-</button>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default Schedule;
