import React, { useState, useEffect } from 'react';
import '../styles/Schedule.css';

const DefaultWeek = ({ username }) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [isAddMode, setIsAddMode] = useState(true);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        const fetchDefaultAvailability = async () => {
            try {
                const response = await fetch(`http://localhost:5000/availability/default?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    const fetchedSlots = new Set(data.defaultWeek.map(item => `${item.day}-${item.time}`));
                    setSelectedSlots(fetchedSlots);
                    console.log('Default availability fetched successfully');
                } else {
                    console.error('Failed to fetch default availability');
                }
            } catch (error) {
                console.error('Error fetching default availability:', error);
            }
        };

        fetchDefaultAvailability();

        const tableWrapper = document.querySelector('.scheduler-table-wrapper');
        const actionButtons = document.querySelector('.action-buttons');

        if (tableWrapper && actionButtons) {
            const wrapperWidth = tableWrapper.clientWidth;
            const daySlotWidth = 100;
            const actionButtonWidth = actionButtons.clientWidth || 100;
            const scrollbarWidth = tableWrapper.offsetWidth - tableWrapper.clientWidth;
            const availableWidth = wrapperWidth - daySlotWidth - actionButtonWidth - scrollbarWidth;
            const numberOfTimeSlots = 48;
            const timeSlotWidth = availableWidth / numberOfTimeSlots;

            document.documentElement.style.setProperty('--timeSlotWidth', `${timeSlotWidth}px`);
        }
    }, [username]);

    const timeSlots = Array.from({ length: 48 }, (_, index) => {
        const hours = Math.floor(index / 2).toString().padStart(2, '0');
        const minutes = (index % 2 === 0 ? '00' : '30');
        return `${hours}:${minutes}`;
    });

    const handleMouseDown = (dayIndex, timeIndex) => {
        setDragging(true);
        setDragStart({ dayIndex, timeIndex });
        setHoveredSlots(new Set([`${dayIndex}-${timeIndex}`]));
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
    };

    const toggleMode = () => {
        setIsAddMode(!isAddMode);
    };

    const handleSave = async () => {
        const defaultWeekData = Array.from(selectedSlots).map(slot => {
            const [dayIndex, timeIndex] = slot.split('-').map(Number);
            return { day: dayIndex, time: timeIndex };
        });

        const saveData = {
            username,
            defaultWeek: defaultWeekData
        };

        try {
            const response = await fetch('http://localhost:5000/availability/default', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });

            if (response.ok) {
                console.log('Default week saved successfully');
            } else {
                console.error('Failed to save default week');
            }
        } catch (error) {
            console.error('Error saving default week:', error);
        }
    };

    return (
        <div className="scheduler-container default-week-container" onMouseUp={handleMouseUp}>
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
                        {daysOfWeek.map((day, dayIndex) => (
                            <tr key={dayIndex}>
                                <td className="scheduler-day-slot">{day}</td>
                                {timeSlots.map((_, timeIndex) => {
                                    const slotKey = `${dayIndex}-${timeIndex}`;
                                    const isHovered = hoveredSlots.has(slotKey);
                                    const isSelected = selectedSlots.has(slotKey);
                                    const className = `time-slot ${
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
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="action-buttons">
                <button className={isAddMode ? 'active' : ''} onClick={toggleMode}>+</button>
                <button className={!isAddMode ? 'active' : ''} onClick={toggleMode}>-</button>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default DefaultWeek;
