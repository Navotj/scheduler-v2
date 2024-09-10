import { useState, useEffect } from 'react';

const useTemplateHandling = ({ username, selectedSlots, setSelectedSlots }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(''); // Keep track of the selected template
    const [newTemplateName, setNewTemplateName] = useState(''); // Track name for new template if necessary

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

    const handleSaveTemplate = async (templateName) => {
        if (selectedSlots.size === 0) {
            alert('No slots selected for this template.');
            return; // Stop saving if no slots are selected
        }

        const templateData = Array.from(selectedSlots).map(slot => {
            const [dayIndex, timeIndex] = slot.split('-').map(Number);
            if (!isNaN(dayIndex) && !isNaN(timeIndex)) {
                return { day: dayIndex, time: timeIndex };
            } else {
                console.error('Invalid slot format or unexpected data type:', slot);
                return null;
            }
        }).filter(slot => slot !== null);

        const saveData = {
            username,
            templateName: templateName.trim(),
            weekTemplate: templateData,
        };

        try {
            // Check if a template with the same name exists
            const existingTemplateIndex = templates.findIndex(t => t.templateName === templateName);
            
            const response = await fetch('http://localhost:5000/availability/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });

            if (response.ok) {
                setTemplates((prev) => {
                    // If template exists, replace it
                    if (existingTemplateIndex !== -1) {
                        const updatedTemplates = [...prev];
                        updatedTemplates[existingTemplateIndex] = saveData;
                        return updatedTemplates;
                    } 
                    // If template doesn't exist, add it
                    else {
                        return [...prev, saveData];
                    }
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
        if (template && template.weekTemplate) {
            const newSelectedSlots = new Set();
            template.weekTemplate.forEach(({ day, time }) => {
                newSelectedSlots.add(`${day}-${time}`);
            });
            setSelectedSlots(newSelectedSlots);
        }
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
        console.log('Template selected from dropdown:', templateName);  // Logging the selected template

        if (templateName === 'new') {
            const name = prompt('Please enter a name for the new template:');
            if (name && name.trim()) {
                const trimmedName = name.trim();
                setNewTemplateName(trimmedName); // Set the name for the new template
                setSelectedTemplate(trimmedName); // Also set it as the selected template for future saves
            }
        } else {
            setSelectedTemplate(templateName);
            setNewTemplateName(''); // Clear newTemplateName, as we're now editing an existing template

            const template = templates.find(t => t.templateName === templateName);
            if (template) {
                handleApplyTemplate(template);
            }
        }
    };
    const handleSave = () => {
        // Check if an existing template is selected and it's not "new"
        if (selectedTemplate && selectedTemplate !== 'new') {
            // Directly save to the selected template (overwrite it)
            handleSaveTemplate(selectedTemplate);
        } else {
            // If no template is selected or the "new" option is selected, prompt for a new name
            const templateName = prompt('Enter a name for the new template:');
            if (templateName && templateName.trim()) {
                const trimmedName = templateName.trim();
                setNewTemplateName(trimmedName); // Set the new template name
                setSelectedTemplate(trimmedName); // Set it as the current template
                handleSaveTemplate(trimmedName); // Save under the new name
            } else {
                alert('Template name is required.'); // Handle case when no name is provided
            }
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
    };
};

export default useTemplateHandling;
