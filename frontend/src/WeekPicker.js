import React, { useState, useEffect } from 'react';

const WeekPicker = ({ username, onWeekSelect }) => {
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);

    useEffect(() => {
        populateWeeks();
    }, []);

    const populateWeeks = () => {
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay());

        const weeksArray = [];

        for (let i = 0; i < 12; i++) {
            const startOfWeek = new Date(currentWeekStart);
            startOfWeek.setDate(currentWeekStart.getDate() + i * 7);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const weekNumber = getWeekNumber(startOfWeek);

            weeksArray.push({
                weekNumber,
                startOfWeek,
                endOfWeek,
            });
        }

        setWeeks(weeksArray);
    };

    const getWeekNumber = (date) => {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000) / 86400000;
        return Math.floor(diff / 7) + 1;
    };

    const handleWeekClick = (week) => {
        setSelectedWeek(week);
        onWeekSelect(week);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}>
            {weeks.map((week, index) => (
                <div
                    key={index}
                    className={`week ${selectedWeek === week ? 'selected' : ''}`}
                    onClick={() => handleWeekClick(week)}
                    style={{
                        cursor: 'pointer',
                        margin: '2px 0',
                        padding: '10px',
                        backgroundColor: '#1e1e1e',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flex: '1',
                    }}
                >
                    Week {week.weekNumber} ({week.startOfWeek.toLocaleDateString()} - {week.endOfWeek.toLocaleDateString()})
                </div>
            ))}
        </div>
    );
};

export default WeekPicker;
