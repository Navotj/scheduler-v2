import { useState, useEffect } from 'react';

const useTemplateHandling = ({ username, selectedSlots }) => {
    const [templates, setTemplates] = useState([]);

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
        const templateData = Array.from(selectedSlots).map(slot => {
            const [dayIndex, timeIndex] = slot.split('-').map(Number);
            return { day: dayIndex, time: timeIndex };
        });

        const saveData = {
            username,
            templateName,
            weekTemplate: templateData,
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
        return newSelectedSlots;
    };

    return { templates, handleSaveTemplate, handleApplyTemplate };
};

export default useTemplateHandling;
