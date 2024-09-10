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

    // Define selectedTemplate and setSelectedTemplate
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Initialize selectedSlots using UseSlotSelection
    const { selectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp, setSelectedSlots } = UseSlotSelection(activeMode, daysOfWeek, resetMode, selectedTemplate, null);

    // Initialize template handling after selectedSlots is initialized
    const {
        templates,
        newTemplateName,
        handleSaveTemplate,
        handleApplyTemplate,
        applyTemplateToSlots,  
        handleDeleteTemplate,
        handleTemplateChange,
        handleSave,
    } = UseTemplateHandling({ username, selectedSlots, setSelectedSlots });

    // Ensure slots get updated when a template is applied
    const applyTemplate = (template) => {
        if (template && template.weekTemplate) {
            const newSelectedSlots = new Set();
            template.weekTemplate.forEach(({ day, time }) => {
                newSelectedSlots.add(`${day}-${time}`);
            });
            setSelectedSlots(newSelectedSlots); 
        }
    };

    useEffect(() => {
        if (selectedTemplate) {
            const template = templates.find(t => t.templateName === selectedTemplate);
            console.log('Selected Template:', selectedTemplate);
            console.log('Applying Template:', template);
            applyTemplate(template);
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
                    handleTemplateChange={(event) => setSelectedTemplate(event.target.value)}
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
