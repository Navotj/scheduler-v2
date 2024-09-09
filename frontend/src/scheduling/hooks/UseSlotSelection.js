import { useState } from 'react';

const useSlotSelection = (activeMode, days, resetMode, selectedTemplate, applyTemplateToSlots) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());

    const getWeekBounds = (dayIndex) => {
        const dayDate = new Date(days[dayIndex]);
        const dayOfWeek = dayDate.getDay();  // 0=Sunday, 6=Saturday
        const startOfWeek = dayIndex - dayOfWeek;
        const endOfWeek = startOfWeek + 6; 
        return { startOfWeek: Math.max(0, startOfWeek), endOfWeek: Math.min(days.length - 1, endOfWeek) };
    };

    const handleSlotClick = (dayIndex, timeIndex) => {
        const newSelectedSlots = new Set(selectedSlots);

        if (activeMode === 'add') {
            newSelectedSlots.add(`${dayIndex}-${timeIndex}`);
        } else if (activeMode === 'remove') {
            newSelectedSlots.delete(`${dayIndex}-${timeIndex}`);
        } else if (activeMode === 'clearWeek') {
            const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
            for (let i = startOfWeek; i <= endOfWeek; i++) {
                for (let j = 0; j < 48; j++) {
                    newSelectedSlots.delete(`${i}-${j}`);
                }
            }
            setHoveredSlots(new Set());
            resetMode();
        } else if (activeMode === 'applyTemplate') {
            const { startOfWeek } = getWeekBounds(dayIndex);
            applyTemplateToSlots(startOfWeek);  // Apply template to the selected week
            resetMode();
        }

        setSelectedSlots(newSelectedSlots);
    };

    const handleMouseDown = (dayIndex, timeIndex) => {
        if (activeMode === 'clearWeek' || activeMode === 'applyTemplate') {
            return; // Prevent individual slot selection in these modes
        }
        setDragging(true);
        setDragStart({ dayIndex, timeIndex });
        setHoveredSlots(new Set([`${dayIndex}-${timeIndex}`]));
    };

    const handleMouseOver = (dayIndex, timeIndex) => {
        if (activeMode === 'clearWeek' || activeMode === 'applyTemplate') {
            const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
            const newHoveredSlots = new Set();
            for (let i = startOfWeek; i <= endOfWeek; i++) {
                for (let j = 0; j < 48; j++) {
                    newHoveredSlots.add(`${i}-${j}`);
                }
            }
            setHoveredSlots(newHoveredSlots);
        } else if (dragging) {
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

    const handleMouseUp = () => {
        if (!dragging) return;

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

    return { selectedSlots, setSelectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp };
};

export default useSlotSelection;
