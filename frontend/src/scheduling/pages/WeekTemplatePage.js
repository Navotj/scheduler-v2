import React, { useEffect } from 'react';
import SchedulerTable from '../components/SchedulerTable';
import ActionBar from '../components/ActionBar';
import UseSlotSelection from '../hooks/UseSlotSelection';
import UseTemplateHandling from '../hooks/UseTemplateHandling';
import calculateSlotDimensions from '../utils/calculateSlotDimensions';  // Import the util
import '../styles/Schedule.css';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeekTemplatePage = ({ username }) => {
    const { selectedSlots, handleSlotClick, handleMouseDown, handleMouseOver } = UseSlotSelection();
    const { templates, handleSaveTemplate, handleApplyTemplate } = UseTemplateHandling({ username, selectedSlots });

    useEffect(() => {
        calculateSlotDimensions();
        window.addEventListener('resize', calculateSlotDimensions);
        return () => window.removeEventListener('resize', calculateSlotDimensions);
    }, []);

    return (
        <div className="scheduler-container" onMouseUp={handleMouseOver}>
            <SchedulerTable
                selectedSlots={selectedSlots}
                handleSlotClick={handleSlotClick}
                handleMouseDown={handleMouseDown}
                handleMouseOver={handleMouseOver}
                days={daysOfWeek}
                totalDays={7}
            />
            <ActionBar
                templates={templates}
                handleSaveTemplate={handleSaveTemplate}
                mode="template"
            />
        </div>
    );
};

export default WeekTemplatePage;
