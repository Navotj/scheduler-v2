import React, { useState, useEffect } from 'react';

const AvailabilityPicker = ({ week, availability: initialAvailability, onAvailabilitySubmit, username }) => {
    const [availability, setAvailability] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [dragAction, setDragAction] = useState('add');

    useEffect(() => {
        if (initialAvailability && initialAvailability.length > 0) {
            const availabilityMap = {};
            initialAvailability[0].times.forEach(range => {
                for (let i = range.start; i < range.end; i++) {
                    availabilityMap[i] = true;
                }
            });
            setAvailability(availabilityMap);
        } else {
            setAvailability({});
        }
    }, [initialAvailability]);

    const updateAvailability = (slot, action) => {
        setAvailability(prev => {
            const newAvailability = { ...prev };

            if (action === 'add') {
                newAvailability[slot] = true;
            } else if (action === 'remove') {
                delete newAvailability[slot];
            }

            return newAvailability;
        });
    };

    const resetDraggingState = () => {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
    };

    const handleMouseDown = (rowIndex, columnIndex) => {
        setIsDragging(true);
        setDragStart([rowIndex, columnIndex]);
        setDragEnd([rowIndex, columnIndex]);
    };

    const handleMouseEnter = (rowIndex, columnIndex) => {
        if (isDragging) {
            setDragEnd([rowIndex, columnIndex]);
        }
    };

    const handleMouseUp = () => {
        if (isDragging && dragStart && dragEnd) {
            const [startRow, startColumn] = dragStart;
            const [endRow, endColumn] = dragEnd;

            const startRowMin = Math.min(startRow, endRow);
            const startColumnMin = Math.min(startColumn, endColumn);
            const endRowMax = Math.max(startRow, endRow);
            const endColumnMax = Math.max(startColumn, endColumn);

            for (let row = startRowMin; row <= endRowMax; row++) {
                for (let column = startColumnMin; column <= endColumnMax; column++) {
                    const slot = row * 48 + column;
                    updateAvailability(slot, dragAction);
                }
            }
        }
        resetDraggingState();
    };

    const getDragStyle = (rowIndex, columnIndex) => {
        if (!dragStart || !dragEnd) return {};
        
        const [startRow, startColumn] = dragStart;
        const [endRow, endColumn] = dragEnd;
    
        const isWithinDragArea =
            rowIndex >= Math.min(startRow, endRow) &&
            rowIndex <= Math.max(startRow, endRow) &&
            columnIndex >= Math.min(startColumn, endColumn) &&
            columnIndex <= Math.max(startColumn, endColumn);
    
        return isWithinDragArea
            ? { backgroundColor: dragAction === 'add' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)' }
            : {};
    };
    

    const handleMouseLeaveTable = () => {
        if (isDragging) {
            resetDraggingState();
        }
    };

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
    
        try {
            const response = await fetch('http://localhost:5000/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
    
            if (response.ok) {
                console.log('Availability saved successfully');
            } else {
                console.error('Failed to save availability');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    
    
const response = await fetch('http://localhost:5000/save', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
});
if (response.ok) {
    console.log('Availability saved successfully');
} else {
    console.error('Failed to save availability');
}
    };
    

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeSlots = Array(24).fill(null).map((_, i) => `${i}`);

    const weekStartDate = new Date(week.startDate);

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative', height: '100%' }}
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
                                <th style={{ width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', backgroundColor: '#333' }}></th>
                                {timeSlots.map((time, index) => (
                                    <th
                                        key={index}
                                        colSpan={2}
                                        className="timeLabel"
                                        style={{ minWidth: '40px', backgroundColor: '#333' }}
                                    >
                                        {time}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {daysOfWeek.map((day, dayIndex) => {
                                const currentDate = new Date(weekStartDate);
                                currentDate.setDate(weekStartDate.getDate() + dayIndex);
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
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {day} | {formattedDate}
                                        </td>
                                        {Array(48).fill(null).map((_, slotIndex) => {
                                            const slot = dayIndex * 48 + slotIndex;
                                            return (
                                                <td
                                                    key={slotIndex}
                                                    className={`slot ${availability[slot] ? 'clicked' : ''}`}
                                                    onMouseDown={() => handleMouseDown(dayIndex, slotIndex)}
                                                    onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                                                    onMouseUp={handleMouseUp}
                                                    style={{
                                                        minWidth: '20px',
                                                        maxWidth: '40px',
                                                        height: 'calc(100% / 7)',
                                                        borderRight: slotIndex % 2 === 1 ? '2px solid #555' : 'none',
                                                        outline: 'none',
                                                        backgroundColor: availability[slot] ? '#0f0' : '',
                                                        ...getDragStyle(dayIndex, slotIndex),
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
                style={{ display: 'flex', justifyContent: 'center', position: 'relative', bottom: '0px', width: '100%', padding: '10px' }}
            >
                <button
                    style={{
                        backgroundColor: dragAction === 'add' ? 'darkgreen' : '#4a4a4a',
                        color: 'white',
                        padding: '10px',
                        marginRight: '10px',
                        flex: 0.23,
                        cursor: 'pointer',
                    }}
                    onClick={() => setDragAction('add')}
                >
                    +
                </button>
                <button
                    style={{
                        backgroundColor: dragAction === 'remove' ? 'darkred' : '#4a4a4a',
                        color: 'white',
                        padding: '10px',
                        marginRight: '10px',
                        flex: 0.23,
                        cursor: 'pointer',
                    }}
                    onClick={() => setDragAction('remove')}
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
                    onClick={handleSave}
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
                    onClick={() => setAvailability({})}
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default AvailabilityPicker;
