import { useState } from 'react';

const useSlotSelection = (activeMode, days, resetMode, templates = [], selectedTemplate = '') => {
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
            console.log('Week cleared, newSelectedSlots:', newSelectedSlots);
            setHoveredSlots(new Set());
            resetMode();
        } else if (activeMode === 'applyTemplate') {
            const { startOfWeek, endOfWeek } = getWeekBounds(dayIndex);
            const firstWeekStartOffset = new Date(days[startOfWeek]).getDay();  // Get how far the first week starts from Sunday (0 = Sunday, 6 = Saturday)
        
            // Clear selected slots in the week before applying the template
            for (let i = startOfWeek; i <= endOfWeek; i++) {
                for (let j = 0; j < 48; j++) {
                    newSelectedSlots.delete(`${i}-${j}`);
                }
            }
        
            if (Array.isArray(templates) && selectedTemplate) {
                const template = templates.find(t => t.templateName === selectedTemplate);
                if (template) {
                    template.weekTemplate.forEach(({ day: templateDay, time }) => {
                        // Skip first days of the template if the first week starts mid-week
                        if (templateDay >= firstWeekStartOffset) {
                            const targetDay = startOfWeek + (templateDay - firstWeekStartOffset);  // Map the template day to the current week's day
                            if (targetDay >= startOfWeek && targetDay <= endOfWeek) {
                                newSelectedSlots.add(`${targetDay}-${time}`);  // Add the slot to the correct day in the clicked week
                            }
                        }
                    });
                }
            } else {
                console.error('Templates or selectedTemplate is not defined');
            }
        
            setHoveredSlots(new Set());
            resetMode();
        }
        
        
        
    
        // Log the updated state and apply the changes
        console.log('Updating selectedSlots:', newSelectedSlots);
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
