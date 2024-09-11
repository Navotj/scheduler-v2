import React, { useState, useEffect } from 'react';

const ActionBar = ({
    isSaving, 
    handleSaveTemplate, 
    handleSave, 
    templates, 
    handleDeleteTemplate, 
    mode, 
    selectedTemplate, 
    newTemplateName, 
    handleTemplateChange, 
    toggleMode, 
    activeMode
}) => {
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      // Set up a timer to clear the error message after 1 second
      if (errorMessage) {
        const timer = setTimeout(() => {
          setErrorMessage("");
        }, 1000);
        return () => clearTimeout(timer); // Cleanup timer on component unmount or errorMessage change
      }
    }, [errorMessage]);

    // New method to handle the template creation manually
    const handleCreateNewTemplate = () => {
        const name = prompt("Please enter a new template name:");
        if (name && name.trim()) {
            handleTemplateChange({ target: { value: name.trim() } }); // Trigger the same event flow with the new template name
        }
    };

    return (
        <div className="action-buttons">
            {mode === "template" && (
                <>
                    <select value={selectedTemplate || ""} onChange={(e) => {
                        if (e.target.value === "new") {
                            handleCreateNewTemplate();  // Manually trigger the prompt
                        } else {
                            handleTemplateChange(e);  // For existing templates, use the normal handler
                        }
                    }}>
                        <option value="" disabled hidden>Select Template</option>

                        {/* Create New Template option */}
                        <option value="new">+ Create New Template</option>

                        {templates.map(template => (
                            <option key={template.templateName} value={template.templateName}>
                                {template.templateName}
                            </option>
                        ))}
                    </select>

                    <button onClick={() => handleSave(selectedTemplate)}>Save Template</button>
                    <button onClick={() => handleDeleteTemplate(selectedTemplate)}>Delete Template</button>
                    <button className={`add-button ${activeMode === 'add' ? 'active' : ''}`} onClick={() => toggleMode('add')}>+</button>
                    <button className={`remove-button ${activeMode === 'remove' ? 'active' : ''}`} onClick={() => toggleMode('remove')}>-</button>
                </>
            )}
            {mode === "schedule" && (
                <>
                    <select value={selectedTemplate || ""} onChange={handleTemplateChange}>
                        <option value="" disabled hidden>Select Template</option>
                        {templates.map(template => (
                            <option key={template.templateName} value={template.templateName}>
                                {template.templateName}
                            </option>
                        ))}
                    </select>

                    <button 
                        className={`apply-template-button ${activeMode === 'applyTemplate' ? 'active' : ''}`} 
                        onClick={() => toggleMode('applyTemplate')}
                    >
                        Apply Template
                    </button>

                    <button 
                        className={`clear-week-button ${activeMode === 'clearWeek' ? 'active' : ''}`} 
                        onClick={() => toggleMode('clearWeek')}
                    >
                        Clear Week
                    </button>
                    <button 
                        className={`add-button ${activeMode === 'add' ? 'active' : ''}`} 
                        onClick={() => toggleMode('add')}
                    >
                        +
                    </button>
                    <button 
                        className={`remove-button ${activeMode === 'remove' ? 'active' : ''}`} 
                        onClick={() => toggleMode('remove')}
                    >
                        -
                    </button>
                    <button onClick={handleSave}>Save</button>

                    {errorMessage && <div className="alert-box">{errorMessage}</div>}
                </>
            )}
            {isSaving && <div className="alert-box">Saving...</div>}
        </div>
    );
};

export default ActionBar;
