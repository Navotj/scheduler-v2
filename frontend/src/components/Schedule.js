import React, { useState, useEffect } from 'react';
import '../styles/Schedule.css';

const Schedule = ({ username, onAvailabilitySubmit }) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [isAddMode, setIsAddMode] = useState(true);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());

    const intervalMinutes = 30; // 30 minutes per slot
    const totalDays = 60; // 60 days for 2 months

    useEffect(() => {
        const tableWrapper = document.querySelector('.scheduler-table-wrapper');
        const actionButtons = document.querySelector('.action-buttons');
    
        if (tableWrapper && actionButtons) {
            const wrapperWidth = tableWrapper.clientWidth;
            const daySlotWidth = 100; // Adjust based on your specific day slot width
            const actionButtonWidth = actionButtons.clientWidth || 100;
    
            // Assuming a typical scrollbar width (you might need to fine-tune this for your specific layout)
            const scrollbarWidth = tableWrapper.offsetWidth - tableWrapper.clientWidth;    
            const availableWidth = wrapperWidth - daySlotWidth - actionButtonWidth - scrollbarWidth;
            const numberOfTimeSlots = 48;
            const timeSlotWidth = availableWidth / numberOfTimeSlots;
    
            document.documentElement.style.setProperty('--timeSlotWidth', `${timeSlotWidth}px`);
        }

        const fetchAvailability = async () => {
            try {
                const response = await fetch(`/availability?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    const loadedSlots = new Set();
                    data.times.forEach(({ startDate }) => {
                        const date = new Date(startDate);
                        const dayIndex = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24));
                        const timeIndex = date.getHours() * 2 + (date.getMinutes() / 30);
                        loadedSlots.add(`${dayIndex}-${timeIndex}`);
                    });
                    setSelectedSlots(loadedSlots);
                }
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        fetchAvailability();
    }, [username]);

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
            const startDayIndex = Math.min(dragStart.dayIndex, dayIndex);
            const endDayIndex = Math.max(dragStart.dayIndex, dayIndex);
            const startTimeIndex = Math.min(dragStart.timeIndex, timeIndex);
            const endTimeIndex = Math.max(dragStart.timeIndex, timeIndex);

            const newHoveredSlots = new Set();
            for (let d = startDayIndex; d <= endDayIndex; d++) {
                for (let t = startTimeIndex; t <= endTimeIndex; t++) {
                    newHoveredSlots.add(`${d}-${t}`);
                }
            }
            setHoveredSlots(newHoveredSlots);
        }
    };

    const handleMouseUp = () => {
        if (dragging) {
            const newSelectedSlots = new Set(selectedSlots);
            hoveredSlots.forEach(slot => {
                if (isAddMode) {
                    newSelectedSlots.add(slot);
                } else {
                    newSelectedSlots.delete(slot);
                }
            });
            setSelectedSlots(newSelectedSlots);
            setHoveredSlots(new Set());
        }
        setDragging(false);
        setDragStart(null);
        setDragEnd(null);
    };

    const condenseTimeSlots = (slots) => {
        if (slots.length === 0) return [];

        const sortedSlots = slots.sort((a, b) => {
            const [aDay, aTime] = a.split('-').map(Number);
            const [bDay, bTime] = b.split('-').map(Number);
            return aDay - bDay || aTime - bTime;
        });

        const condensed = [];
        let start = generateTimeSlot(...sortedSlots[0].split('-').map(Number)).startDate;
        let end = generateTimeSlot(...sortedSlots[0].split('-').map(Number)).endDate;

        for (let i = 1; i < sortedSlots.length; i++) {
            const [dayIndex, timeIndex] = sortedSlots[i].split('-').map(Number);
            const { startDate, endDate } = generateTimeSlot(dayIndex, timeIndex);

            if (startDate === end) {
                end = endDate;
            } else {
                condensed.push({ startDate: start, endDate: end });
                start = startDate;
                end = endDate;
            }
        }
        condensed.push({ startDate: start, endDate: end });

        return condensed;
    };

    const generateTimeSlot = (dayIndex, timeIndex) => {
        const startTime = new Date();
        startTime.setHours(0, 0, 0, 0);
        startTime.setDate(startTime.getDate() + dayIndex);
        startTime.setMinutes(timeIndex * intervalMinutes);

        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + intervalMinutes);

        return { startDate: startTime.toISOString(), endDate: endTime.toISOString() };
    };

    const handleSave = async () => {
        const times = condenseTimeSlots(Array.from(selectedSlots));
        const scheduleData = {
            username: username,
            times: times.map(({ startDate, endDate }) => ({ startDate, endDate })),
        };
    
        try {
            const response = await fetch('/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            });
            if (response.ok) {
                console.log('Data saved successfully');
            } else {
                console.log('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };
    

    const timeSlots = Array.from({ length: 48 }, (_, index) => {
        const hours = Math.floor(index / 2).toString().padStart(2, '0');
        const minutes = (index % 2 === 0 ? '00' : '30');
        return `${hours}:${minutes}`;
    });

    return (
        <div className="scheduler-container" onMouseUp={handleMouseUp}>
            <div className="scheduler-table-wrapper">
                <table className="scheduler-table">
                    <thead>
                        <tr>
                            <th className="scheduler-day-slot"></th>
                            {timeSlots.map((time, timeIndex) => {
                                if (time.endsWith(":00")) {
                                    let hour = time.split(':')[0];
                                    hour = (parseInt(hour.startsWith('0') ? hour.substring(1) : hour) + 1).toString().padStart(2, '0');
                                    return (
                                        <th key={timeIndex} className="scheduler-time-header" colSpan="2">
                                            {hour}
                                        </th>
                                    );
                                }
                                return null;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: totalDays }).map((_, dayIndex) => {
                            const currentDay = new Date();
                            currentDay.setDate(currentDay.getDate() + dayIndex);
                            const dayOfWeek = currentDay.getDay();
                            const isEndOfWeek = dayOfWeek === 6;

                            return (
                                <tr key={dayIndex}>
                                    <td className={`scheduler-day-slot ${isEndOfWeek ? 'end-of-week' : ''}`}>
                                        {currentDay.toLocaleDateString('en-US', { weekday: 'short' })} <br /> {currentDay.toLocaleDateString()}
                                    </td>
                                    {timeSlots.map((_, timeIndex) => {
                                        const slotKey = `${dayIndex}-${timeIndex}`;
                                        const isHovered = hoveredSlots.has(slotKey);
                                        const isSelected = selectedSlots.has(slotKey);
                                        const className = `time-slot ${isEndOfWeek ? 'end-of-week-border' : ''} ${
                                            isSelected ? 'selected-slot' : ''
                                        } ${
                                            isHovered && isSelected && !isAddMode ? 'hovered-slot-remove' : isHovered ? 'hovered-slot' : ''
                                        }`;
                                        
                                        return (
                                            <td
                                                key={timeIndex}
                                                className={className}
                                                onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                                onMouseOver={() => handleMouseOver(dayIndex, timeIndex)}
                                            />
                                        );
                                    })}
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
