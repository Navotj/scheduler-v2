import { useState, useEffect } from 'react';

const useSlotSelection = (activeMode, toggleMode, days, resetMode, templates = [], selectedTemplate = '') => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());
    const [lastMode, setLastMode] = useState(null);
    const [modeLock, setModeLock] = useState(false); // Add a mode lock

    const getWeekBounds = (dayIndex) => {
        const dayDate = new Date(days[dayIndex]);
        const dayOfWeek = dayDate.getDay();  // 0=Sunday, 6=Saturday
        const startOfWeek = dayIndex - dayOfWeek;
        const endOfWeek = startOfWeek + 6;
        return { startOfWeek: Math.max(0, startOfWeek), endOfWeek: Math.min(days.length - 1, endOfWeek) };
    };

    // Only save + or - as lastMode
    useEffect(() => {
        if ((activeMode === 'add' || activeMode === 'remove') && !modeLock) {
            setLastMode(activeMode);
        }
    }, [activeMode, modeLock]);

    // Normal slot click logic (for +, - modes)
    const handleSlotClick = (dayIndex, timeIndex) => {
        if (modeLock) return; // Prevent actions if mode is locked after a clearWeek/applyTemplate

        const newSelectedSlots = new Set(selectedSlots);

        if (activeMode === 'add') {
            newSelectedSlots.add(`${dayIndex}-${timeIndex}`);
        } else if (activeMode === 'remove') {
            newSelectedSlots.delete(`${dayIndex}-${timeIndex}`);
        }

        setSelectedSlots(newSelectedSlots);
    };

    // Logic for dragging in normal +, - modes
    const handleNormalMouseOver = (dayIndex, timeIndex) => {
        if (dragging && !modeLock) {
            const newHoveredSlots = new Set();
            const startDayIndex = Math.min(dragStart.dayIndex, dayIndex);
            const endDayIndex = Math.max(dragStart.dayIndex, dayIndex);
            const startTimeIndex = Math.min(dragStart.timeIndex, timeIndex);
            const endTimeIndex = Math.max(dragStart.timeIndex, timeIndex);

            for (let d = startDayIndex; d <= endDayIndex; d++) {
                for (let t = startTimeIndex; t <= endTimeIndex; t++) {
                    newHoveredSlots.add(`${d}-${t}`);
                }
            }
            setHoveredSlots(newHoveredSlots);
        }
    };

    const handleNormalMouseUp = () => {
        if (!dragging || modeLock) return;

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
        setDragging(false);
    };

    // Week-based logic for clearWeek and applyTemplate modes
    const handleWeekMouseDown = (dayIndex) => {
        setDragging(true);
        setModeLock(true); // Lock the mode while clearWeek/applyTemplate is running
        setDragStart({ dayIndex });
        const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
        const newHoveredSlots = new Set();
        for (let i = startOfWeek; i <= endOfWeek; i++) {
            for (let j = 0; j < 48; j++) {
                newHoveredSlots.add(`${i}-${j}`);
            }
        }
        setHoveredSlots(newHoveredSlots);
    };

    const handleWeekMouseOver = (dayIndex) => {
        if (dragging) {
            const startWeekIndex = Math.min(dragStart.dayIndex, dayIndex);
            const endWeekIndex = Math.max(dragStart.dayIndex, dayIndex);

            const newHoveredSlots = new Set();
            for (let d = startWeekIndex; d <= endWeekIndex; d++) {
                const { startOfWeek, endOfWeek } = getWeekBounds(d);
                for (let i = startOfWeek; i <= endOfWeek; i++) {
                    for (let j = 0; j < 48; j++) {
                        newHoveredSlots.add(`${i}-${j}`);
                    }
                }
            }
            setHoveredSlots(newHoveredSlots);
        }
    };

    const handleWeekMouseUp = () => {
        if (!dragging) return;

        const newSelectedSlots = new Set(selectedSlots);
        hoveredSlots.forEach(slot => {
            if (activeMode === 'clearWeek') {
                const [dayIndex] = slot.split('-').map(Number);
                const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
                for (let i = startOfWeek; i <= endOfWeek; i++) {
                    for (let j = 0; j < 48; j++) {
                        newSelectedSlots.delete(`${i}-${j}`);
                    }
                }
            } else if (activeMode === 'applyTemplate') {
                const [dayIndex] = slot.split('-').map(Number);
                const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
                const firstWeekStartOffset = new Date(days[startOfWeek]).getDay();

                for (let i = startOfWeek; i <= endOfWeek; i++) {
                    for (let j = 0; j < 48; j++) {
                        newSelectedSlots.delete(`${i}-${j}`);
                    }
                }

                if (Array.isArray(templates) && selectedTemplate) {
                    const template = templates.find(t => t.templateName === selectedTemplate);
                    if (template) {
                        template.weekTemplate.forEach(({ day: templateDay, time }) => {
                            if (templateDay >= firstWeekStartOffset) {
                                const targetDay = startOfWeek + (templateDay - firstWeekStartOffset);
                                if (targetDay >= startOfWeek && targetDay <= endOfWeek) {
                                    newSelectedSlots.add(`${targetDay}-${time}`);
                                }
                            }
                        });
                    }
                }
            }
        });

        setSelectedSlots(newSelectedSlots);
        setHoveredSlots(new Set());
        setDragging(false);

        // Unlock the mode after a small delay to avoid immediate interaction in the next mode
        setTimeout(() => {
            toggleMode(lastMode);  // Automatically switch back to lastMode
            setModeLock(false); // Unlock the mode
        }, 100);  // Delay to prevent immediate slot actions
    };

    // Entry point based on active mode
    const handleMouseDown = (dayIndex, timeIndex) => {
        if (activeMode === 'clearWeek' || activeMode === 'applyTemplate') {
            handleWeekMouseDown(dayIndex);
        } else {
            setDragging(true);
            setDragStart({ dayIndex, timeIndex });
            setHoveredSlots(new Set([`${dayIndex}-${timeIndex}`]));
        }
    };

    const handleMouseOver = (dayIndex, timeIndex) => {
        if (activeMode === 'clearWeek' || activeMode === 'applyTemplate') {
            handleWeekMouseOver(dayIndex);
        } else {
            handleNormalMouseOver(dayIndex, timeIndex);
        }
    };

    const handleMouseUp = () => {
        if (activeMode === 'clearWeek' || activeMode === 'applyTemplate') {
            handleWeekMouseUp();
        } else {
            handleNormalMouseUp();
        }
    };

    return { selectedSlots, setSelectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp, lastMode };
};

export default useSlotSelection;
