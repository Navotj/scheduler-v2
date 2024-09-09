import { useState, useEffect } from 'react';

const useTemplateHandling = ({ username, selectedSlots, setSelectedSlots }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [newTemplateName, setNewTemplateName] = useState('');

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
    }, [username]);

    const applyTemplateToSlots = (startOfWeek) => {
        if (!selectedTemplate) return;

        const newSelectedSlots = new Set();
        const currentWeekStart = new Date();
        currentWeekStart.setDate(currentWeekStart.getDate() + startOfWeek);

        selectedTemplate.weekTemplate.forEach(({ day, time }) => {
            const dayOffset = startOfWeek + day;  // Adjust day for the selected week
            const slotTime = generateEpochForTime(dayOffset, time);  // Convert slot to epoch
            newSelectedSlots.add(slotTime);
        });

        setSelectedSlots(newSelectedSlots);
    };

    const generateEpochForTime = (dayOffset, timeIndex) => {
        const slotDate = new Date();
        slotDate.setDate(slotDate.getDate() + dayOffset);
        slotDate.setHours(0, 0, 0, 0);  // Start at midnight
        slotDate.setMinutes(timeIndex * 30);  // Adjust for time slot
        return slotDate.getTime();
    };

    const handleSaveTemplate = async (templateName) => {
        console.log("Selected Slots:", selectedSlots);
    
        const templateData = Array.from(selectedSlots).map(slot => {
            const [dayIndex, timeIndex] = slot.split('-').map(Number);
            if (!isNaN(dayIndex) && !isNaN(timeIndex)) {
                return { day: dayIndex, time: timeIndex };
            } else {
                console.error('Invalid slot format or unexpected data type:', slot);
                return null;
            }
        }).filter(slot => slot !== null);
    
        if (typeof templateName !== 'string') {
            console.error('Invalid template name:', templateName);
            alert('Template name is invalid.');
            return;
        }
    
        const saveData = {
            username,
            templateName: templateName,
            weekTemplate: templateData,
        };
    
        try {
            console.log("Saving data:", saveData);
            const response = await fetch('http://localhost:5000/availability/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });
    
            if (response.ok) {
                setTemplates((prev) => {
                    const updatedTemplates = prev.map(t => (t.templateName === templateName ? saveData : t));
                    if (!updatedTemplates.some(t => t.templateName === templateName)) {
                        updatedTemplates.push(saveData);
                    }
                    return updatedTemplates;
                });
                alert('Template saved successfully!');
            } else {
                console.error('Failed to save template');
                alert('Failed to save template. Please try again.');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            alert('An error occurred while saving the template.');
        }
    };

    const handleApplyTemplate = (template) => {
        const newSelectedSlots = new Set();
        template.weekTemplate.forEach(({ day, time }) => {
            newSelectedSlots.add(`${day}-${time}`);
        });
        setSelectedSlots(newSelectedSlots);
    };

    const handleDeleteTemplate = async (templateName) => {
        try {
            const response = await fetch('http://localhost:5000/availability/templates', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, templateName }),
            });

            if (response.ok) {
                setTemplates(prevTemplates => prevTemplates.filter(t => t.templateName !== templateName));
                setSelectedSlots(new Set());
                alert('Template deleted');
            } else {
                alert('Failed to delete template');
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('An error occurred while deleting the template.');
        }
    };

    const handleTemplateChange = (event) => {
        const templateName = event.target.value;

        if (templateName === 'new') {
            const name = prompt('Please enter a name for the new template:');
            if (name && name.trim()) {
                const trimmedName = name.trim();
                setNewTemplateName(trimmedName);
                setSelectedTemplate(trimmedName);
            }
        } else {
            setSelectedTemplate(templateName);
            setNewTemplateName('');

            const template = templates.find(t => t.templateName === templateName);
            if (template) {
                handleApplyTemplate(template);
            }
        }
    };

    const handleSave = () => {
        if (!selectedTemplate && !newTemplateName) {
            const name = prompt('Please enter a name for the new template:');
            if (name && name.trim()) {
                setNewTemplateName(name.trim());
                handleSaveTemplate(name.trim());
            }
        } else {
            const templateNameToSave = newTemplateName || selectedTemplate;
            handleSaveTemplate(templateNameToSave);
        }
    };

    return {
        templates,
        selectedTemplate,
        newTemplateName,
        handleSaveTemplate,
        handleApplyTemplate,
        handleDeleteTemplate,
        handleTemplateChange,
        handleSave,
        applyTemplateToSlots,  // Return this function
    };
};

export default useTemplateHandling;
