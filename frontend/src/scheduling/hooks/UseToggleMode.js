import { useState } from 'react';

const useToggleMode = (initialMode = 'add') => {
    const [activeMode, setActiveMode] = useState(initialMode);
    const [lastMode, setLastMode] = useState(initialMode);

    const toggleMode = (mode) => {
        if (mode === 'add' || mode === 'remove') {
            // Toggle between add and remove modes
            if (activeMode === mode) {
                setActiveMode(mode === 'add' ? 'remove' : 'add');
            } else {
                setActiveMode(mode);
            }
        } else if (mode === 'applyTemplate' || mode === 'clearWeek') {
            setLastMode(activeMode); // Save last non-template mode
            setActiveMode(mode); // Switch to template/clear week mode
        } else {
            setActiveMode(mode);
        }
    };

    const resetMode = () => {
        setActiveMode(lastMode); // Revert to the last non-template mode after template/clearWeek is done
    };

    return { activeMode, toggleMode, resetMode, setLastMode };
};

export default useToggleMode;
