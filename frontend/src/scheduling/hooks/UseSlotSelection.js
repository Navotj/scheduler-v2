import { useState } from 'react';

const useSlotSelection = (activeMode, days) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());

    const getWeekBounds = (dayIndex) => {
        const dayDate = new Date(days[dayIndex]);
        const dayOfWeek = dayDate.getDay();  // 0=Sunday, 6=Saturday
        const startOfWeek = dayIndex - dayOfWeek;  // Start on Sunday (0)
        const endOfWeek = startOfWeek + 6;   // Always end on Saturday (6 days from Sunday)
        return { startOfWeek: Math.max(0, startOfWeek), endOfWeek: Math.min(days.length - 1, endOfWeek) };
    };

    const handleSlotClick = (dayIndex, timeIndex) => {
        const newSelectedSlots = new Set(selectedSlots);
        const slotKey = `${dayIndex}-${timeIndex}`;

        if (activeMode === 'add') {
            newSelectedSlots.add(slotKey);
        } else if (activeMode === 'remove') {
            newSelectedSlots.delete(slotKey);
        } else if (activeMode === 'clearWeek') {
            const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
            for (let i = startOfWeek; i <= endOfWeek; i++) {
                for (let j = 0; j < 48; j++) {
                    const weekSlotKey = `${i}-${j}`;
                    newSelectedSlots.delete(weekSlotKey);
                }
            }
        }

        setSelectedSlots(newSelectedSlots);
    };

    const handleMouseDown = (dayIndex, timeIndex) => {
        setDragging(true);
        setDragStart({ dayIndex, timeIndex });
        setHoveredSlots(new Set([`${dayIndex}-${timeIndex}`]));  // Start by hovering the first slot
    };

    const handleMouseOver = (dayIndex, timeIndex) => {
        if (!dragging && activeMode !== 'clearWeek') return;

        const newHoveredSlots = new Set();

        if (activeMode === 'clearWeek') {
            const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
            for (let i = startOfWeek; i <= endOfWeek; i++) {
                for (let j = 0; j < 48; j++) {
                    newHoveredSlots.add(`${i}-${j}`);
                }
            }
        } else {
            const startDayIndex = Math.min(dragStart.dayIndex, dayIndex);
            const endDayIndex = Math.max(dragStart.dayIndex, dayIndex);
            const startTimeIndex = Math.min(dragStart.timeIndex, timeIndex);
            const endTimeIndex = Math.max(dragStart.timeIndex, timeIndex);

            for (let d = startDayIndex; d <= endDayIndex; d++) {
                for (let t = startTimeIndex; t <= endTimeIndex; t++) {
                    newHoveredSlots.add(`${d}-${t}`);
                }
            }
        }

        setHoveredSlots(newHoveredSlots);
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
        setHoveredSlots(new Set());  // Clear the hover after drag is done
        setDragging(false);
    };

    return { selectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp };
};

export default useSlotSelection;
