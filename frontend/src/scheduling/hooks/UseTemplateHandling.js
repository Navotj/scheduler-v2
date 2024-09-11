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
            // Send POST request to save or update the template
            const response = await fetch('http://localhost:5000/availability/templates', {
                method: 'POST',  // Ensure it's POST as we are using upsert in the backend
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });
    
            if (response.ok) {
                const updatedTemplate = await response.json();
                console.log('Template saved/updated successfully:', updatedTemplate);
                alert('Template saved successfully!');
            } else {
                const errorData = await response.json();
                console.error('Failed to save template:', errorData);
                alert('Failed to save template. Error: ' + errorData.error);
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
    
        // When the user selects "Create New Template"
        if (templateName === 'new') {
            const name = prompt('Please enter a name for the new template:');
            
            if (name && name.trim()) {
                const trimmedName = name.trim();
                setNewTemplateName(trimmedName);  // Set the new template name
                setSelectedTemplate(trimmedName);  // Use this new template name as the selected template
                handleSaveTemplate(trimmedName);   // Save the new template immediately
            } else {
                // If no valid name is entered, reset the selection back to default or previously selected value
                setSelectedTemplate('');  // Reset selected template
            }
        } else {
            // Handle the case for selecting an existing template
            setSelectedTemplate(templateName);
            setNewTemplateName('');  // Clear newTemplateName, as we're now dealing with an existing template
    
            const template = templates.find(t => t.templateName === templateName);
            if (template) {
                handleApplyTemplate(template);  // Apply the selected template
            }
        }
    };
    
    
    const handleSave = (selectedTemplate) => {
        if (selectedTemplate && selectedTemplate !== 'new') {
            handleSaveTemplate(selectedTemplate);  // Save the existing template
        } else {
            // Prompt the user for a new template name
            const templateName = prompt('Enter a name for the new template:');
            if (templateName && templateName.trim()) {
                const trimmedName = templateName.trim();
                setNewTemplateName(trimmedName);  // Set the new template name
                setSelectedTemplate(trimmedName);  // Select the new template
                handleSaveTemplate(trimmedName);   // Save the new template
            } else {
                alert('Template name is required.');
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
