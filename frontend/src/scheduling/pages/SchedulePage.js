// SchedulePage.js
import React, { useEffect } from 'react';
import SchedulerTable from '../components/SchedulerTable';
import ActionBar from '../components/ActionBar';
import UseSlotSelection from '../hooks/UseSlotSelection';
import UseScheduleFetching from '../hooks/UseScheduleFetching';
import UseToggleMode from '../hooks/UseToggleMode';
import UseTemplateHandling from '../hooks/UseTemplateHandling';  // Template handling hook
import '../styles/Schedule.css';
import calculateSlotDimensions from '../utils/calculateSlotDimensions';  // Import the slot dimensions utility

const SchedulePage = ({ username, onAvailabilitySubmit }) => {
    // Function to get the dates for the next N days
    const getDatesForNextNDays = (n) => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < n; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            dates.push(nextDay.toLocaleDateString());
        }
        return dates;
    };

    // Get 60 days for the schedule
    const dates = getDatesForNextNDays(60);

    const { activeMode, toggleMode, resetMode } = UseToggleMode();  // Use the toggleMode hook
    const { selectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp } = UseSlotSelection(activeMode, dates);  // Pass activeMode and dates
    const { isSaving, handleSave } = UseScheduleFetching({ username, selectedSlots, onAvailabilitySubmit });
    const { templates, handleApplyTemplate } = UseTemplateHandling({ username, selectedSlots });  // Fetch templates properly
    const [selectedTemplate, setSelectedTemplate] = React.useState('');

    // Effect to recalculate slot dimensions on resize
    useEffect(() => {
        calculateSlotDimensions();
        window.addEventListener('resize', calculateSlotDimensions);
        return () => window.removeEventListener('resize', calculateSlotDimensions);
    }, []);

    // Handle template change
    const handleTemplateChange = (event) => {
        setSelectedTemplate(event.target.value);
    };

    return (
        <div className="scheduler-container" onMouseUp={handleMouseUp}>
            <SchedulerTable
                selectedSlots={selectedSlots}  // Pass selectedSlots as Set
                hoveredSlots={hoveredSlots}    // Pass hoveredSlots as Set
                handleSlotClick={handleSlotClick}
                handleMouseDown={handleMouseDown}
                handleMouseOver={handleMouseOver}
                handleMouseUp={handleMouseUp}  // Add this for proper dragging functionality
                days={dates}
                totalDays={60}
                activeMode={activeMode}  // Pass active mode to the table
            />
            <ActionBar
                templates={templates}  // Pass the templates correctly
                isSaving={isSaving}
                handleSave={handleSave}
                handleApplyTemplate={() => handleApplyTemplate(templates.find(t => t.templateName === selectedTemplate))}
                mode="schedule"
                selectedTemplate={selectedTemplate}
                handleTemplateChange={handleTemplateChange}  // Choose which template to apply
                toggleMode={toggleMode}  // Pass toggleMode to ActionBar
                activeMode={activeMode}  // Pass active mode to ensure proper highlighting
            />
        </div>
    );
};

export default SchedulePage;
