// ActionBar.js
const ActionBar = ({ isSaving, handleSave, templates, handleApplyTemplate, mode, selectedTemplate, handleTemplateChange, toggleMode, activeMode }) => {
    return (
        <div className="action-buttons">
            {mode === "schedule" && (
                <>
                    <select value={selectedTemplate} onChange={handleTemplateChange}>
                        <option value="" disabled>Select Template</option>
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
                </>
            )}
            {isSaving && <div>Saving...</div>}
        </div>
    );
};

export default ActionBar;
