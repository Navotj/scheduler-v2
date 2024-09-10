import React from 'react';

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
    return (
        <div className="action-buttons">
            {mode === "template" && (
                <>
                    <select value={selectedTemplate} onChange={handleTemplateChange}>
                        <option value="" disabled>Select Template</option>
                        <option value="new">{newTemplateName || "Create New Template"}</option>
                        {templates.map(template => (
                            <option key={`${template.templateName}-${Math.random()}`} value={template.templateName}>
                                {template.templateName}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleSaveTemplate}>Save Template</button>
                    <button onClick={() => handleDeleteTemplate(selectedTemplate)}>Delete Template</button>
                    <button className={`add-button ${activeMode === 'add' ? 'active' : ''}`} onClick={() => toggleMode('add')}>+</button>
                    <button className={`remove-button ${activeMode === 'remove' ? 'active' : ''}`} onClick={() => toggleMode('remove')}>-</button>
                </>
            )}
            {mode === "schedule" && (
                <>
                    <select value={selectedTemplate || newTemplateName} onChange={handleTemplateChange}>
                        <option value="" disabled>{newTemplateName || "Select Template"}</option>
                        <option value="new">Create New Template</option>
                        {templates.map(template => (
                            <option key={`${template.templateName}-${Math.random()}`} value={template.templateName}>
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
                </>
            )}
            {isSaving && <div>Saving...</div>}
        </div>
    );
};

export default ActionBar;
