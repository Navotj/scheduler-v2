import React, { useState, useEffect } from 'react';
import '../styles/Schedule.css';

const Schedule = ({ username, onAvailabilitySubmit }) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());
    const [activeMode, setActiveMode] = useState('add'); // Default to add mode
    const [lastMode, setLastMode] = useState('add'); // Tracks the last mode before clearWeek

    const intervalMinutes = 30; // 30 minutes per slot
    const totalDays = 60; // 60 days for 2 months

    // Helper function to calculate the start of the week (Sunday)
    const getWeekStartIndex = (dayIndex) => {
        const dayOfWeek = dayIndex % 7; // Get the day of the week (0 = Sunday, 6 = Saturday)
        return dayIndex - dayOfWeek; // Calculate the start of the week (Sunday)
    };

    useEffect(() => {
        const tableWrapper = document.querySelector('.scheduler-table-wrapper');
        const actionButtons = document.querySelector('.action-buttons');

        if (tableWrapper && actionButtons) {
            const wrapperWidth = tableWrapper.clientWidth;
            const daySlotWidth = 100; // Adjust based on your specific day slot width
            const actionButtonWidth = actionButtons.clientWidth || 100;

            const scrollbarWidth = tableWrapper.offsetWidth - tableWrapper.clientWidth;
            const availableWidth = wrapperWidth - daySlotWidth - actionButtonWidth - scrollbarWidth;
            const numberOfTimeSlots = 49;
            const timeSlotWidth = availableWidth / numberOfTimeSlots;

            document.documentElement.style.setProperty('--timeSlotWidth', `${timeSlotWidth}px`);
        }

        const fetchAvailability = async () => {
            try {
                const response = await fetch(`http://localhost:5000/availability?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    markSlots(data.times);
                } else {
                    console.log('Failed to fetch availability');
                }
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        const fetchDefaultWeek = async () => {
            try {
                const response = await fetch(`http://localhost:5000/defaultavailability?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    applyDefaultWeek(data.defaultWeek);
                } else {
                    console.log('Failed to fetch default week');
                }
            } catch (error) {
                console.error('Error fetching default week:', error);
            }
        };

        const markSlots = (times) => {
            const newSelectedSlots = new Set();
            const now = new Date();

            times.forEach(({ startDate, endDate }) => {
                const start = new Date(startDate);
                const end = new Date(endDate);

                let dayIndex = Math.floor((start - now) / (1000 * 60 * 60 * 24));
                let startTimeIndex = Math.floor(start.getHours() * 2 + start.getMinutes() / intervalMinutes);
                let endTimeIndex = Math.ceil(end.getHours() * 2 + end.getMinutes() / intervalMinutes);

                for (let i = startTimeIndex; i < endTimeIndex; i++) {
                    newSelectedSlots.add(`${dayIndex}-${i}`);
                }
            });

            setSelectedSlots(newSelectedSlots);
        };

        const applyDefaultWeek = (defaultWeek) => {
            const newSelectedSlots = new Set();

            defaultWeek.forEach(({ day, time }) => {
                for (let dayIndex = 0; dayIndex < totalDays; dayIndex += 7) {
                    const slotKey = `${dayIndex + day}-${time}`;
                    newSelectedSlots.add(slotKey);
                }
            });

            setSelectedSlots(newSelectedSlots);
        };

        fetchAvailability();
        fetchDefaultWeek();
    }, [username]);

    const toggleMode = (mode) => {
        if (activeMode === mode) {
            setActiveMode(''); // Toggle off the mode
        } else {
            setActiveMode(mode); // Set the new active mode
            setHoveredSlots(new Set()); // Clear hover indication when changing mode
        }
    };

    const handleClearWeek = () => {
        if (activeMode === 'clearWeek') {
            // Deactivate Clear Week mode and restore the last mode
            setActiveMode(lastMode);
            setHoveredSlots(new Set()); // Clear hover indication
        } else {
            // Activate Clear Week mode and save the last mode
            setLastMode(activeMode || 'add'); // Save current mode before switching to clearWeek
            setActiveMode('clearWeek');
        }
    };

    const handleMouseDown = (dayIndex, timeIndex) => {
        setDragging(true);
        setDragStart({ dayIndex, timeIndex });
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
        } else if (activeMode === 'clearWeek') {
            // Handle Clear Week Hover
            const startOfWeek = getWeekStartIndex(dayIndex); // Start of the week is Sunday
            const endOfWeek = startOfWeek + 6; // End of the week is Saturday
            const newHoveredSlots = new Set();

            for (let day = startOfWeek; day <= endOfWeek; day++) {
                for (let timeIndex = 0; timeIndex < 48; timeIndex++) {
                    newHoveredSlots.add(`${day}-${timeIndex}`);
                }
            }
            setHoveredSlots(newHoveredSlots);
        }
    };

    const handleMouseUp = () => {
        if (dragging) {
            const newSelectedSlots = new Set(selectedSlots);
            hoveredSlots.forEach(slot => {
                if (activeMode === 'add') {
                    newSelectedSlots.add(slot);
                } else if (activeMode === 'remove') {
                    newSelectedSlots.delete(slot);
                }
            });
            setSelectedSlots(newSelectedSlots);
            setHoveredSlots(new Set());
        }
        setDragging(false);
        setDragStart(null);
    };
    
    const handleSlotClick = (dayIndex, timeIndex) => {
        if (activeMode === 'clearWeek') {
            const newSelectedSlots = new Set(selectedSlots);
            const startOfWeek = getWeekStartIndex(dayIndex); // Start of the week is Sunday
            const endOfWeek = startOfWeek + 6; // End of the week is Saturday
    
            for (let day = startOfWeek; day <= endOfWeek; day++) {
                for (let timeIndex = 0; timeIndex < 48; timeIndex++) {
                    newSelectedSlots.delete(`${day}-${timeIndex}`);
                }
            }
    
            setSelectedSlots(newSelectedSlots);
            setHoveredSlots(new Set()); // Clear hover indication
            setActiveMode(lastMode); // Restore the last mode after clearing
        } else if (activeMode === 'add' || activeMode === 'remove') {
            handleMouseUp();
        }
    };
    const condenseTimeSlots = (slots) => {
        if (slots.length === 0) return [];
        
        const sortedSlots = slots.sort((a, b) => {
            const [aDay, aTime] = a.split('-').map(Number);
            const [bDay, bTime] = b.split('-').map(Number);
            return aDay - bDay || aTime - bTime;
        });
        
        const condensed = [];
        let currentRange = null;
        
        sortedSlots.forEach(slot => {
            const [dayIndex, timeIndex] = slot.split('-').map(Number);
            const { startDate, endDate } = generateTimeSlot(dayIndex, timeIndex);
        
            if (currentRange) {
                if (startDate <= currentRange.endDate + 1000 * 60 * intervalMinutes) {
                    currentRange.endDate = Math.max(currentRange.endDate, endDate);
                } else {
                    condensed.push(currentRange);
                    currentRange = { startDate, endDate };
                }
            } else {
                currentRange = { startDate, endDate };
            }
        });
        
        if (currentRange) {
            condensed.push(currentRange);
        }
        
        return condensed;
    };
    
    const generateTimeSlot = (dayIndex, timeIndex) => {
        const startTime = new Date();
        startTime.setHours(0, 0, 0, 0);
        startTime.setDate(startTime.getDate() + dayIndex);
        startTime.setMinutes(timeIndex * intervalMinutes);
    
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + intervalMinutes);
    
        // Avoid the end time being exactly the same as the next slot's start time
        endTime.setSeconds(endTime.getSeconds() - 1);
    
        return {
            startDate: startTime.getTime(), // Use epoch time
            endDate: endTime.getTime(),     // Use epoch time
        };
    };

    const handleSave = async () => {
        const times = condenseTimeSlots(Array.from(selectedSlots));
        const scheduleData = {
            username: username,
            times: times.map(({ startDate, endDate }) => ({ startDate, endDate })),
        };

        try {
            const response = await fetch('http://localhost:5000/availability', {
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
                <div className="scheduler-background-bar"></div>
                <table className="scheduler-table">
                    <thead>
                        <tr>
                            <th className="scheduler-day-slot"></th>
                            {timeSlots.map((time, timeIndex) => {
                                if (time.endsWith(":00")) {
                                    let hour = time.split(':')[0];
                                    hour = (parseInt(hour.startsWith('0') ? hour.substring(1) : hour) + 1).toString();
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
                            currentDay.setDate(currentDay.getDate() + dayIndex); // Start from the current day
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
                                            isHovered && activeMode === 'clearWeek' ? 'clear-week-hover' : isHovered ? 'hovered-slot' : ''
                                        }`;
                                        
                                        return (
                                            <td
                                                key={timeIndex}
                                                className={className}
                                                data-day-index={dayIndex}
                                                onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                                onMouseOver={() => handleMouseOver(dayIndex, timeIndex)}
                                                onClick={() => handleSlotClick(dayIndex, timeIndex)}
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
                    className={activeMode === 'add' ? 'active' : ''} 
                    onClick={() => toggleMode('add')}
                >+</button>
                <button
                    className={activeMode === 'remove' ? 'active' : ''} 
                    onClick={() => toggleMode('remove')}
                >-</button>
                <button onClick={handleSave}>Save</button>
                <button 
                    className={activeMode === 'clearWeek' ? 'active' : ''} 
                    onClick={handleClearWeek}
                >
                    Clear Week
                </button>
                <button onClick={handleClearWeek}>Reset Week</button> {/* Placeholder for Reset Week Button */}
            </div>
        </div>
    );
};

export default Schedule;
