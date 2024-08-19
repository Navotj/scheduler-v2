// Import necessary modules from React
import React, { useState, useEffect } from 'react';

/**
 * AvailabilityPicker is a React component that allows users to select their availability
 * for a given week. The user can click and drag to select or deselect time slots.
 * 
 * Props:
 * - week: An object representing the current week with a week number and start date.
 * - availability: The initial availability data, which is an array of time ranges.
 * - onAvailabilitySubmit: A function that gets called when the user submits their availability.
 * - username: The name of the user who is setting their availability.
 */
const AvailabilityPicker = ({ week, availability: initialAvailability, onAvailabilitySubmit, username }) => {

    // useState is a special function that creates a state variable in React.
    // We use it here to keep track of the availability selected by the user.
    const [availability, setAvailability] = useState({});
    // This state variable tracks whether the user is currently dragging their mouse across the grid.
    const [isDragging, setIsDragging] = useState(false);
    // These state variables store where the user started and ended their drag.
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    // This state variable tracks whether the user is adding or removing availability.
    const [dragAction, setDragAction] = useState('add');

// useEffect is a special function in React that runs some code after the component
// has been rendered (shown on the screen) or after certain variables change.
useEffect(() => {
    // Log the received initialAvailability data to inspect its structure
    console.log('Received initialAvailability:', initialAvailability);

    // Check if there is any initial availability data provided.
    if (initialAvailability && initialAvailability.availability && initialAvailability.availability.length > 0) {
        // Create an empty object to store the availability slots.
        const availabilityMap = {};

        // Loop through each time range in the initial availability data.
        // The 'initialAvailability.availability' array contains the time ranges, each having 'start' and 'end' values.
        initialAvailability.availability.forEach(range => {
            // For each time range, mark all the slots within that range as available.
            for (let i = range.start; i < range.end; i++) {
                // Mark the slot as available by setting its corresponding entry in 'availabilityMap' to 'true'.
                availabilityMap[i] = true;
            }
        });

        // Update the availability state with the data we've loaded.
        setAvailability(availabilityMap);
        console.log('Initial availability loaded:', availabilityMap);
    } else {
        // If no initial availability data is provided, start with an empty state.
        setAvailability({});
        console.log('No initial availability provided.');
    }
}, [initialAvailability]); // The code in this effect runs whenever 'initialAvailability' changes.



    // This function updates the availability state when the user selects or deselects a time slot.
    const updateAvailability = (slot, action) => {
        // We use setAvailability to update the state in a functional way, meaning it works reliably
        // even if multiple updates happen at the same time.
        setAvailability(prev => {
            // Create a copy of the current availability state.
            const newAvailability = { ...prev };

            // If the action is 'add', mark the slot as available.
            if (action === 'add') {
                newAvailability[slot] = true;
            } 
            // If the action is 'remove', delete the slot from the availability.
            else if (action === 'remove') {
                delete newAvailability[slot];
            }

            // Return the updated availability state.
            return newAvailability;
        });
    };

    // This function resets the dragging state after the user finishes dragging.
    const resetDraggingState = () => {
        setIsDragging(false); // Stop the dragging action.
        setDragStart(null); // Clear the drag start coordinates.
        setDragEnd(null); // Clear the drag end coordinates.
    };

    // This function is called when the user presses down the mouse button on a slot.
    const handleMouseDown = (rowIndex, columnIndex) => {
        setIsDragging(true); // Start the dragging action.
        setDragStart([rowIndex, columnIndex]); // Record where the dragging started.
        setDragEnd([rowIndex, columnIndex]); // Initialize the drag end to the same position.
    };

    // This function is called when the user moves their mouse over another slot while dragging.
    const handleMouseEnter = (rowIndex, columnIndex) => {
        if (isDragging) {
            setDragEnd([rowIndex, columnIndex]); // Update the drag end to the current position.
        }
    };

    // This function is called when the user releases the mouse button.
    const handleMouseUp = () => {
        if (isDragging && dragStart && dragEnd) {
            const [startRow, startColumn] = dragStart; // Get the start coordinates.
            const [endRow, endColumn] = dragEnd; // Get the end coordinates.

            // Calculate the minimum and maximum row and column values to figure out the drag area.
            const startRowMin = Math.min(startRow, endRow);
            const startColumnMin = Math.min(startColumn, endColumn);
            const endRowMax = Math.max(startRow, endRow);
            const endColumnMax = Math.max(startColumn, endColumn);

            // Loop through all the slots within the drag area and update their availability.
            for (let row = startRowMin; row <= endRowMax; row++) {
                for (let column = startColumnMin; column <= endColumnMax; column++) {
                    const slot = row * 48 + column; // Calculate the slot number.
                    updateAvailability(slot, dragAction); // Add or remove the slot based on dragAction.
                }
            }
        }
        resetDraggingState(); // Reset the dragging state.
    };

    // This function calculates the style for a slot to show the drag effect (e.g., highlighting).
    const getDragStyle = (rowIndex, columnIndex) => {
        if (!dragStart || !dragEnd) return {}; // If dragging hasn't started, return an empty style.

        const [startRow, startColumn] = dragStart; // Get the start coordinates.
        const [endRow, endColumn] = dragEnd; // Get the end coordinates.

        // Check if the current slot is within the area that the user is dragging over.
        const isWithinDragArea =
            rowIndex >= Math.min(startRow, endRow) &&
            rowIndex <= Math.max(startRow, endRow) &&
            columnIndex >= Math.min(startColumn, endColumn) &&
            columnIndex <= Math.max(startColumn, endColumn);

        // If the slot is within the drag area, apply a background color to it.
        return isWithinDragArea
            ? { backgroundColor: dragAction === 'add' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)' }
            : {}; // Use green for adding and red for removing availability.
    };

    // This function is called when the mouse leaves the table, and it resets the dragging state.
    const handleMouseLeaveTable = () => {
        if (isDragging) {
            resetDraggingState();
        }
    };

    // This function is called when the user clicks the "Save" button to save their availability.
    const handleSave = async () => {
        const formattedAvailability = [];
        let currentRange = null;
    
        const sortedSlots = Object.keys(availability).map(Number).sort((a, b) => a - b);
    
        sortedSlots.forEach(slot => {
            if (currentRange === null) {
                currentRange = { start: slot, end: slot + 1 };
            } else if (currentRange.end === slot) {
                currentRange.end = slot + 1;
            } else {
                formattedAvailability.push(currentRange);
                currentRange = { start: slot, end: slot + 1 };
            }
        });
    
        if (currentRange) {
            formattedAvailability.push(currentRange);
        }
    
        const payload = {
            username,
            week: week.weekNumber,
            availability: formattedAvailability
        };
    
        console.log('Saving availability with payload:', payload); // Log the payload being sent
    
        try {
            // Set a timeout for the fetch request to avoid hanging indefinitely
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
    
            const response = await fetch('http://localhost:5000/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal // Pass the abort signal to the fetch request
            });
    
            clearTimeout(timeoutId); // Clear the timeout if the request completes
    
            console.log('Received response from server:', response); // Log the entire response
    
            // Check if the server responded positively.
            if (response.ok) {
                console.log('Availability saved successfully');
            } else {
                console.error('Failed to save availability, response status:', response.status);
            }
        } catch (error) {
            // If there's an error, log it to the console.
            if (error.name === 'AbortError') {
                console.error('Request timed out');
            } else {
                console.error('Error saving availability:', error);
            }
        }
    };
    
    // These arrays store the days of the week and the hours of the day to create the grid.
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeSlots = Array(24).fill(null).map((_, i) => `${i + 1}`); // Creates an array of hour labels with ":00" suffix.
    const weekStartDate = new Date(week.startDate); // Converts the week start date to a Date object.

    return (
        // The main container for the component, styled as a flexbox.
        <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'calc(100% - 12px)', position: 'relative', height: '100vh', paddingLeft: '25px' }} // Set to full viewport height
        >
            <div
                style={{ overflowX: 'auto', flexGrow: 1, width: '100%' }}
                onMouseUp={handleMouseUp}
            >
                <div style={{ flexGrow: 1 }}>
                    <table
                        onMouseLeave={handleMouseLeaveTable}
                        style={{ width: '100%', tableLayout: 'fixed', height: '100%' }}
                    >
                    <thead>
                        <tr>
                            <th style={{ width: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}></th>
                            <th style={{ minWidth: '20px'}}></th> {/* Empty column to shift the hours */}
                            {timeSlots.map((time, index) => (
                                <th
                                    key={index}
                                    colSpan={2} // Keep the colspan as 2
                                    className="timeLabel"
                                >
                                    {time}
                                </th>
                            ))}
                        </tr>
                    </thead>
                        <tbody>
                            {daysOfWeek.map((day, dayIndex) => {
                                const currentDate = new Date(weekStartDate);
                                currentDate.setDate(weekStartDate.getDate() + dayIndex); // Calculate the date for each day.
                                const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
                                return (
                                    <tr key={dayIndex}>
                                        <td
                                            className="dayLabel"
                                            style={{
                                                width: '100px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                backgroundColor: '#333',
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                paddingLeft: '15px'
                                            }}
                                        >
                                            {day} | {formattedDate} {/* Display day and date */}
                                        </td>
                                        {Array(48).fill(null).map((_, slotIndex) => {
                                            const slot = dayIndex * 48 + slotIndex; // Calculate the slot number.
                                            return (
                                                <td
                                                    key={slotIndex}
                                                    className={`slot ${availability[slot] ? 'clicked' : ''}`} // Highlight if the slot is selected.
                                                    onMouseDown={() => handleMouseDown(dayIndex, slotIndex)} // Calls handleMouseDown on mouse down.
                                                    onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)} // Calls handleMouseEnter on mouse over.
                                                    onMouseUp={handleMouseUp} // Calls handleMouseUp on mouse up.
                                                    style={{
                                                        minWidth: '20px',
                                                        maxWidth: '40px',
                                                        borderRight: slotIndex % 2 === 1 ? '2px solid #555' : 'none',
                                                        outline: 'none',
                                                        backgroundColor: availability[slot] ? '#0f0' : '', // Set color if slot is selected.
                                                        ...getDragStyle(dayIndex, slotIndex), // Apply drag style.
                                                    }}
                                                />
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div
                id="actionButtons"
                style={{ display: 'flex', justifyContent: 'left', position: 'relative', bottom: '30px', right: '10px', width: '98%' }}
            >
                <button
                    style={{
                        backgroundColor: dragAction === 'add' ? 'darkgreen' : '#4a4a4a', // Highlight the add button if it's selected.
                        color: 'white',
                        padding: '10px',
                        marginRight: '10px',
                        flex: 0.23,
                        cursor: 'pointer',
                    }}
                    onClick={() => setDragAction('add')} // Switch to adding mode when clicked.
                >
                    +
                </button>
                <button
                    style={{
                        backgroundColor: dragAction === 'remove' ? 'darkred' : '#4a4a4a', // Highlight the remove button if it's selected.
                        color: 'white',
                        padding: '10px',
                        marginRight: '10px',
                        flex: 0.23,
                        cursor: 'pointer',
                    }}
                    onClick={() => setDragAction('remove')} // Switch to removing mode when clicked.
                >
                    -
                </button>
                <button
                    style={{
                        backgroundColor: '#4a4a4a',
                        color: 'white',
                        padding: '10px',
                        marginRight: '10px',
                        flex: 0.48,
                        cursor: 'pointer',
                    }}
                    onClick={handleSave} // Calls handleSave to save the availability.
                >
                    Save
                </button>
                <button
                    style={{
                        backgroundColor: '#4a4a4a',
                        color: 'white',
                        padding: '10px',
                        flex: 0.48,
                        cursor: 'pointer',
                    }}
                    onClick={() => setAvailability({})} // Clear all availability slots when clicked.
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

// This is the export statement, which makes the component available to be used in other files.
export default AvailabilityPicker;
