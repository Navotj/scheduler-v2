import React, { useState, useEffect } from 'react';
import '../styles/Schedule.css';

const WeekTemplate = ({ username }) => {
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [isAddMode, setIsAddMode] = useState(true);
    const [hoveredSlots, setHoveredSlots] = useState(new Set());
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [templateName, setTemplateName] = useState('');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`http://localhost:5000/availability/templates?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setTemplates(data.templates || []);
                } else {
                    console.error('Failed to fetch templates');
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        fetchTemplates();

        const calculateSlotDimensions = () => {
            const tableWrapper = document.querySelector('.scheduler-table-wrapper');

            if (tableWrapper) {
                const wrapperWidth = tableWrapper.clientWidth;
                const daySlotWidth = 100; 
                const scrollbarWidth = tableWrapper.offsetWidth - tableWrapper.clientWidth;
                const availableWidth = wrapperWidth - daySlotWidth - scrollbarWidth - 5;
                const numberOfTimeSlots = 49;
                const timeSlotWidth = availableWidth / numberOfTimeSlots;

                document.documentElement.style.setProperty('--TimeSlotWidth', `${timeSlotWidth}px`);
            }
        };

        calculateSlotDimensions();
        window.addEventListener('resize', calculateSlotDimensions);

        return () => window.removeEventListener('resize', calculateSlotDimensions);
    }, [username]);

    const timeSlots = Array.from({ length: 48 }, (_, index) => {
        const hours = Math.floor(index / 2).toString().padStart(2, '0');
        const minutes = (index % 2 === 0 ? '00' : '30');
        return `${hours}:${minutes}`;
    });

    const handleMouseDown = (dayIndex, timeIndex) => {
        setDragging(true);
        setDragStart({ dayIndex, timeIndex });
        setHoveredSlots(new Set([`${dayIndex}-${timeIndex}`]));
    };

    const handleMouseOver = (dayIndex, timeIndex) => {
        if (dragging) {
            const startDayIndex = Math.min(dragStart.dayIndex, dayIndex);
            const endDayIndex = Math.max(dragStart.dayIndex, dayIndex);
            const startTimeIndex = Math.min(dragStart.timeIndex, timeIndex);
            const endTimeIndex = Math.max(dragStart.timeIndex, timeIndex);

            const newHoveredSlots = new Set();
            for (let d = startDayIndex; d <= endDayIndex; d++) {
                for (let t = startTimeIndex; t <= endTimeIndex; t++) {
                    newHoveredSlots.add(`${d}-${t}`);
                }
            }
            setHoveredSlots(newHoveredSlots);
        }
    };

    const handleMouseUp = () => {
        if (dragging) {
            const newSelectedSlots = new Set(selectedSlots);
            hoveredSlots.forEach(slot => {
                if (isAddMode) {
                    newSelectedSlots.add(slot);
                } else {
                    newSelectedSlots.delete(slot);
                }
            });
            setSelectedSlots(newSelectedSlots);
            setHoveredSlots(new Set());
        }
        setDragging(false);
    };

    const toggleMode = () => {
        setIsAddMode(!isAddMode);
    };

    const handleSaveTemplate = async () => {
        let nameToSave = templateName;
    
        if (!nameToSave) {
            nameToSave = prompt("You haven't entered a template name. Please enter a name to save this template:");
            if (!nameToSave) {
                alert("Template not saved because no name was provided.");
                return;
            }
    
            // Check if the name already exists
            if (templates.some(t => t.templateName === nameToSave)) {
                alert("Template name already exists. Please choose a different name.");
                return;
            }
        }
    
        const templateData = Array.from(selectedSlots).map(slot => {
            const [dayIndex, timeIndex] = slot.split('-').map(Number);
            return { day: dayIndex, time: timeIndex };
        });
    
        const saveData = {
            username,
            templateName: nameToSave,
            weekTemplate: templateData
        };
    
        try {
            const response = await fetch('http://localhost:5000/availability/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });
    
            if (response.ok) {
                console.log('Template saved successfully');
                const updatedTemplates = templates.map(t => t.templateName === nameToSave ? saveData : t);
                if (!updatedTemplates.some(t => t.templateName === nameToSave)) {
                    updatedTemplates.push(saveData);
                }
                setTemplates(updatedTemplates);
                setTemplateName(''); // Clear the template name input after saving
    
                // Switch to the newly saved template
                setSelectedTemplate(nameToSave);
    
                // Show a success message
                alert("Template saved successfully!");
            } else {
                console.error('Failed to save template');
                alert("Failed to save template. Please try again.");
            }
        } catch (error) {
            console.error('Error saving template:', error);
            alert("An error occurred while saving the template.");
        }
    };
    
    const handleApplyTemplate = (template) => {
        const newSelectedSlots = new Set();
        template.weekTemplate.forEach(({ day, time }) => {
            newSelectedSlots.add(`${day}-${time}`);
        });
        setSelectedSlots(newSelectedSlots);
    };

    const handleTemplateChange = (event) => {
        const templateName = event.target.value;
        if (templateName === "create_new") {
            const newTemplateName = prompt("Enter new template name:");
            if (newTemplateName) {
                if (templates.some(t => t.templateName === newTemplateName)) {
                    alert("Template name already exists. Please choose a different name.");
                } else {
                    setTemplateName(newTemplateName);
                    setSelectedTemplate(newTemplateName); // Update dropdown to show new template name
                    setSelectedSlots(new Set()); // Clear selected slots for new template
                    
                    // Add the new template name to the templates array for displaying in the dropdown
                    setTemplates([...templates, { templateName: newTemplateName, weekTemplate: [] }]);
                }
            }
        } else {
            setSelectedTemplate(templateName);
            const template = templates.find(t => t.templateName === templateName);
            handleApplyTemplate(template);
        }
    };
    
    const handleDeleteTemplate = async () => {
        if (!selectedTemplate) {
            alert("Please select a template to delete.");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you wish to delete the ${selectedTemplate} template?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/availability/templates`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, templateName: selectedTemplate }),
            });

            if (response.ok) {
                setTemplates(templates.filter(template => template.templateName !== selectedTemplate));
                setSelectedTemplate(''); // Clear the selection after deletion
                setSelectedSlots(new Set()); // Clear selected slots
                alert("Template deleted successfully.");
            } else {
                console.error('Failed to delete template');
            }
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    

    return (
        <div className="scheduler-container week-template-container" onMouseUp={handleMouseUp}>
            <div className="week-template-table-wrapper">
                <div className="scheduler-background-bar"></div>
                <table className="scheduler-table">
                    <thead>
                        <tr>
                            <th className="scheduler-day-slot"></th>
                            {timeSlots.map((time, timeIndex) => (
                                time.endsWith(":00") ? (
                                    <th key={timeIndex} className="scheduler-time-header" colSpan="2">
                                        {parseInt(time.split(':')[0]) + 1}
                                    </th>
                                ) : null
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {daysOfWeek.map((day, dayIndex) => (
                            <tr key={dayIndex}>
                                <td className="scheduler-day-slot">{day}</td>
                                {timeSlots.map((_, timeIndex) => {
                                    const slotKey = `${dayIndex}-${timeIndex}`;
                                    const isHovered = hoveredSlots.has(slotKey);
                                    const isSelected = selectedSlots.has(slotKey);
                                    const className = `time-slot ${isSelected ? 'selected-slot' : ''} ${isHovered && isSelected && !isAddMode ? 'hovered-slot-remove' : isHovered ? 'hovered-slot' : ''}`;
                                    return (
                                        <td
                                            key={timeIndex}
                                            className={className}
                                            onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                            onMouseOver={() => handleMouseOver(dayIndex, timeIndex)}
                                        />
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="action-buttons">
                <select value={selectedTemplate} onChange={handleTemplateChange}>
                    <option value="" disabled>Select Template</option>
                    <option value="create_new">Create New Template</option>
                    {templates.map(template => (
                        <option key={template.templateName} value={template.templateName}>
                            {template.templateName}
                        </option>
                    ))}
                </select>
                <button onClick={handleSaveTemplate}>Save Template</button>
                <button onClick={handleDeleteTemplate}>Delete Template</button> {/* Add this line */}
                <button className={isAddMode ? 'active' : ''} onClick={toggleMode}>+</button>
                <button className={!isAddMode ? 'active' : ''} onClick={toggleMode}>-</button>
            </div>
        </div>
    );
};

export default WeekTemplate;
