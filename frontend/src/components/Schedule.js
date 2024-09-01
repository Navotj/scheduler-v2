import React, { useState, useEffect } from 'react';
import '../styles/Schedule.css';

const Schedule = ({ username, onAvailabilitySubmit }) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());
    const [activeMode, setActiveMode] = useState('add');
    const [lastMode, setLastMode] = useState('add');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [isSaving, setIsSaving] = useState(false);  // New state for saving indication

    useEffect(() => {
        return () => {
            // If the component is unmounting, immediately remove the saving indicator
            if (isSaving) {
                setIsSaving(false);
            }
        };
    }, [isSaving]);


    const intervalMinutes = 30;
    const totalDays = 60;

    const getWeekStartIndex = (dayIndex) => {
        const currentDay = new Date();
        currentDay.setDate(currentDay.getDate() + dayIndex);
        const dayOfWeek = currentDay.getDay();
        return dayIndex - dayOfWeek;
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`http://localhost:5000/availability/templates?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setTemplates(data.templates || []);
                } else {
                    console.log('Failed to fetch templates');
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        fetchTemplates();

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

        fetchAvailability();

        const calculateSlotDimensions = () => {
            const tableWrapper = document.querySelector('.scheduler-table-wrapper');

            if (tableWrapper) {
                const wrapperWidth = tableWrapper.clientWidth;
                const daySlotWidth = 100; 
                const scrollbarWidth = tableWrapper.offsetWidth - tableWrapper.clientWidth;
                const availableWidth = wrapperWidth - daySlotWidth - scrollbarWidth - 5;
                const numberOfTimeSlots = 49;
                const timeSlotWidth = availableWidth / numberOfTimeSlots;

                document.documentElement.style.setProperty('--TimeSlotWidth', `${timeSlotWidth}px`);
            }
        };

        calculateSlotDimensions();
        window.addEventListener('resize', calculateSlotDimensions);

        return () => window.removeEventListener('resize', calculateSlotDimensions);
    }, [username]);

    const toggleMode = (mode) => {
        if (mode === 'add' && activeMode === 'add') {
            setActiveMode('remove');
        } else if (mode === 'remove' && activeMode === 'remove') {
            setActiveMode('add');
        } else {
            setActiveMode(mode);
        }
        setHoveredSlots(new Set());
    };

    const handleApplyTemplate = (template) => {
        const newSelectedSlots = new Set();
        const now = new Date();

        template.weekTemplate.forEach(({ day, time }) => {
            for (let dayIndex = 0; dayIndex < totalDays; dayIndex += 7) {
                const slotKey = `${dayIndex + day}-${time}`;
                newSelectedSlots.add(slotKey);
            }
        });

        setSelectedSlots(newSelectedSlots);
    };

    const handleTemplateChange = (event) => {
        const templateName = event.target.value;
        setSelectedTemplate(templateName);
    };

    const handleApplyTemplateClick = () => {
        if (!selectedTemplate) {
            alert("Please select a template first.");
            return;
        }
        toggleMode('applyTemplate');
    };

    const handleSlotClick = (dayIndex, timeIndex) => {
        if (activeMode === 'applyTemplate') {
            const template = templates.find(t => t.templateName === selectedTemplate);
            if (template) {
                const startOfWeek = getWeekStartIndex(dayIndex);
                const newSelectedSlots = new Set(selectedSlots);

                for (let day = startOfWeek; day <= startOfWeek + 6; day++) {
                    for (let timeIndex = 0; timeIndex < 48; timeIndex++) {
                        newSelectedSlots.delete(`${day}-${timeIndex}`);
                    }
                }

                template.weekTemplate.forEach(({ day, time }) => {
                    const slotKey = `${startOfWeek + day}-${time}`;
                    newSelectedSlots.add(slotKey);
                });

                setSelectedSlots(newSelectedSlots);
                setHoveredSlots(new Set());
                setActiveMode(lastMode);
            }
        } else if (activeMode === 'clearWeek') {
            const newSelectedSlots = new Set(selectedSlots);
            const startOfWeek = getWeekStartIndex(dayIndex);
            const endOfWeek = startOfWeek + 6;

            for (let day = startOfWeek; day <= endOfWeek; day++) {
                for (let timeIndex = 0; timeIndex < 48; timeIndex++) {
                    newSelectedSlots.delete(`${day}-${timeIndex}`);
                }
            }

            setSelectedSlots(newSelectedSlots);
            setHoveredSlots(new Set());
            setActiveMode(lastMode);
        } else {
            handleMouseUp();
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
        } else if (activeMode === 'clearWeek' || activeMode === 'applyTemplate') {
            const startOfWeek = getWeekStartIndex(dayIndex);
            const endOfWeek = startOfWeek + 6;
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
    

    const handleClearWeek = () => {
        if (activeMode === 'clearWeek') {
            setActiveMode(lastMode);
            setHoveredSlots(new Set());
        } else {
            setLastMode(activeMode || 'add');
            setActiveMode('clearWeek');
        }
    };

    const markSlots = (times) => {
        const newSelectedSlots = new Set();
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
        times.forEach(({ startDate, endDate }) => {
            let start = new Date(startDate);
            let end = new Date(endDate);
    
            // Skip slots that end before today
            if (end < startOfToday) return;
    
            // Adjust the start date if it is before today
            if (start < startOfToday) {
                start = startOfToday;
            }
    
            let startDayIndex = Math.floor((start - startOfToday) / (1000 * 60 * 60 * 24));
            let endDayIndex = Math.floor((end - startOfToday) / (1000 * 60 * 60 * 24));
    
            let startTimeIndex = Math.floor(start.getHours() * 2 + start.getMinutes() / intervalMinutes);
            let endTimeIndex = Math.ceil(end.getHours() * 2 + end.getMinutes() / intervalMinutes);
    
            for (let day = startDayIndex; day <= endDayIndex; day++) {
                let timeStart = (day === startDayIndex) ? startTimeIndex : 0;
                let timeEnd = (day === endDayIndex) ? endTimeIndex : 48;
    
                for (let timeIndex = timeStart; timeIndex < timeEnd; timeIndex++) {
                    newSelectedSlots.add(`${day}-${timeIndex}`);
                }
            }
        });
    
        setSelectedSlots(newSelectedSlots);
    };
    
    

    const condenseTimeSlots = (slots) => {
        if (slots.length === 0) return [];
    
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
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
    
            // Skip slots that end before today
            if (endDate < startOfToday.getTime()) return;
    
            // Adjust start date if necessary
            const adjustedStartDate = startDate < startOfToday.getTime() ? startOfToday.getTime() : startDate;
    
            if (currentRange) {
                if (adjustedStartDate <= currentRange.endDate + 1000 * 60 * intervalMinutes) {
                    currentRange.endDate = Math.max(currentRange.endDate, endDate);
                } else {
                    condensed.push(currentRange);
                    currentRange = { startDate: adjustedStartDate, endDate };
                }
            } else {
                currentRange = { startDate: adjustedStartDate, endDate };
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

        endTime.setSeconds(endTime.getSeconds() - 1);

        return {
            startDate: startTime.getTime(),
            endDate: endTime.getTime(),
        };
    };

    const handleSave = async () => {
        setIsSaving(true);  // Indicate saving has started
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
                setIsSaving("saved");  // Update to "saved" status
                setTimeout(() => {
                    if (isSaving === "saved") {  // Only proceed with fade-out if still in "saved" state
                        document.querySelector('.saving-indicator').classList.add('fade-out');
                        setTimeout(() => setIsSaving(false), 500);  // Wait for fade-out to complete
                    }
                }, 2000);  // Keep "Saved." displayed for 2 seconds
            } else {
                console.log('Failed to save data');
                setIsSaving(false);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            setIsSaving(false);
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
                {/* Display a saving indicator */}
                {isSaving && (
                    <div className="saving-indicator">
                        {isSaving === true ? "Saving..." : "Saved."}
                    </div>
                )}
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
                                        } ${isHovered && activeMode === 'applyTemplate' ? 'hovered-slot' : isHovered ? 'hovered-slot' : ''}`;
                                        
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
                <select value={selectedTemplate} onChange={handleTemplateChange}>
                    <option value="" disabled>Select Template</option>
                    {templates.map(template => (
                        <option key={template.templateName} value={template.templateName}>
                            {template.templateName}
                        </option>
                    ))}
                </select>
                <button className={`apply-template-button ${activeMode === 'applyTemplate' ? 'active' : ''}`} onClick={handleApplyTemplateClick}>Apply Template</button>
                <button className={`add-button ${activeMode === 'add' ? 'active' : ''}`} onClick={() => toggleMode('add')}>+</button>
                <button className={`remove-button ${activeMode === 'remove' ? 'active' : ''}`} onClick={() => toggleMode('remove')}>-</button>
                <button className={`clear-week-button ${activeMode === 'clearWeek' ? 'active' : ''}`} onClick={handleClearWeek}>Clear Week</button>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default Schedule;
