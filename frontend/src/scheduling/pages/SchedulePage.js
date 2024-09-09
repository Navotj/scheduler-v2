import React, { useEffect } from 'react';
import SchedulerTable from '../components/SchedulerTable';
import ActionBar from '../components/ActionBar';
import UseSlotSelection from '../hooks/UseSlotSelection';
import UseSaveAvailability from '../hooks/UseSaveAvailability';
import UseToggleMode from '../hooks/UseToggleMode';
import UseTemplateHandling from '../hooks/UseTemplateHandling';
import UseFetchAvailability from '../hooks/UseFetchAvailability';  // Fetch hook import
import '../styles/Schedule.css';
import calculateSlotDimensions from '../utils/calculateSlotDimensions';

const SchedulePage = ({ username, onAvailabilitySubmit }) => {
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

    const dates = getDatesForNextNDays(60);

    const { activeMode, toggleMode, resetMode } = UseToggleMode();
    const { selectedSlots, hoveredSlots, handleSlotClick, handleMouseDown, handleMouseOver, handleMouseUp, setSelectedSlots } = UseSlotSelection(activeMode, dates, resetMode);  // Added setSelectedSlots
    const { isSaving, handleSave } = UseSaveAvailability({ username, selectedSlots, onAvailabilitySubmit });
    const { templates, handleApplyTemplate } = UseTemplateHandling({ username, selectedSlots });
    const [selectedTemplate, setSelectedTemplate] = React.useState('');

    // Fetch availability on load
    UseFetchAvailability({ username, setSelectedSlots });  

    useEffect(() => {
        calculateSlotDimensions();
        window.addEventListener('resize', calculateSlotDimensions);
        return () => window.removeEventListener('resize', calculateSlotDimensions);
    }, []);

    const handleTemplateChange = (event) => {
        setSelectedTemplate(event.target.value);
    };

    return (
        <div className="scheduler-container" onMouseUp={handleMouseUp}>
            <SchedulerTable
                selectedSlots={selectedSlots}
                hoveredSlots={hoveredSlots}
                handleSlotClick={handleSlotClick}
                handleMouseDown={handleMouseDown}
                handleMouseOver={handleMouseOver}
                handleMouseUp={handleMouseUp}
                days={dates}
                totalDays={60}
                activeMode={activeMode}
            />
            <ActionBar
                templates={templates}
                isSaving={isSaving}
                handleSave={handleSave}
                handleApplyTemplate={() => handleApplyTemplate(templates.find(t => t.templateName === selectedTemplate))}
                mode="schedule"
                selectedTemplate={selectedTemplate}
                handleTemplateChange={handleTemplateChange}
                toggleMode={toggleMode}
                activeMode={activeMode}
            />
        </div>
    );
};

export default SchedulePage;
