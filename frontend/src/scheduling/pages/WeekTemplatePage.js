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

    // Initialize selectedTemplate and selectedSlots
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Initialize template handling first to ensure applyTemplateToSlots is available
    const {
        templates,
        newTemplateName,
        handleSaveTemplate,
        handleApplyTemplate,
        applyTemplateToSlots,  // This will now be available before it is used in UseSlotSelection
        handleDeleteTemplate,
        handleTemplateChange,
        handleSave,
    } = UseTemplateHandling({ username, selectedSlots: [], setSelectedSlots: () => {} });  // Pass dummy slots initially

    // Now initialize selectedSlots using UseSlotSelection
    const { selectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp, setSelectedSlots } = UseSlotSelection(activeMode, daysOfWeek, resetMode, selectedTemplate, applyTemplateToSlots);

    // Ensure slots get updated when a template is applied
    const applyTemplate = (template) => {
        if (template && template.weekTemplate) {
            const newSelectedSlots = new Set();
            template.weekTemplate.forEach(({ day, time }) => {
                newSelectedSlots.add(`${day}-${time}`);
            });
            setSelectedSlots(newSelectedSlots); // Update selectedSlots to reflect template application
        }
    };

    useEffect(() => {
        if (selectedTemplate) {
            const template = templates.find(t => t.templateName === selectedTemplate);
            applyTemplate(template); // Apply template when selectedTemplate changes
        }
    }, [selectedTemplate, templates]);

    useEffect(() => {
        calculateSlotDimensions();
        window.addEventListener('resize', calculateSlotDimensions);
        return () => window.removeEventListener('resize', calculateSlotDimensions);
    }, []);

    return (
        <div className="template-container">
            <div className="scheduler-container" onMouseUp={handleMouseUp}>
                <SchedulerTable
                    selectedSlots={selectedSlots}  // Pass updated selectedSlots to SchedulerTable
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
                    handleTemplateChange={(event) => setSelectedTemplate(event.target.value)}  // Update selectedTemplate
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
