import React, { useEffect, useState } from 'react';
import SchedulerTable from '../components/SchedulerTable';
import ActionBar from '../components/ActionBar';
import UseSlotSelection from '../hooks/UseSlotSelection';
import UseTemplateHandling from '../hooks/UseTemplateHandling';
import UseToggleMode from '../hooks/UseToggleMode';  
import calculateSlotDimensions from '../utils/calculateSlotDimensions';
import '../styles/Schedule.css';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeekTemplatePage = ({ username }) => {
    const { activeMode, toggleMode, resetMode } = UseToggleMode();
    
    // UseTemplateHandling should return applyTemplateToSlots function
    const {
        templates,
        selectedTemplate,
        newTemplateName,
        handleSaveTemplate,
        handleApplyTemplate,
        applyTemplateToSlots,  // Get the function from UseTemplateHandling
        handleDeleteTemplate,
        handleTemplateChange,
        handleSave,
    } = UseTemplateHandling({ username, selectedSlots, setSelectedSlots });

    // Make sure applyTemplateToSlots is passed to UseSlotSelection
    const { selectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp, setSelectedSlots } = UseSlotSelection(activeMode, daysOfWeek, resetMode, selectedTemplate, applyTemplateToSlots);

    useEffect(() => {
        calculateSlotDimensions();
        window.addEventListener('resize', calculateSlotDimensions);
        return () => window.removeEventListener('resize', calculateSlotDimensions);
    }, []);

    return (
        <div className="template-container">
            <div className="scheduler-container" onMouseUp={handleMouseUp}>
                <SchedulerTable
                    selectedSlots={selectedSlots}
                    hoveredSlots={hoveredSlots}
                    handleSlotClick={handleSlotClick}
                    handleMouseDown={handleMouseDown}
                    handleMouseOver={handleMouseOver}
                    handleMouseUp={handleMouseUp}
                    days={daysOfWeek}
                    totalDays={7}
                    activeMode={activeMode}
                />
                <ActionBar
                    templates={templates}
                    handleSaveTemplate={handleSave}
                    selectedTemplate={selectedTemplate}
                    newTemplateName={newTemplateName}
                    handleTemplateChange={handleTemplateChange}
                    toggleMode={toggleMode}
                    activeMode={activeMode}
                    handleDeleteTemplate={handleDeleteTemplate}
                    mode="template"
                />
            </div>
        </div>
    );
};

export default WeekTemplatePage;
