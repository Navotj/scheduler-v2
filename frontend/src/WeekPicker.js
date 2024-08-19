import React, { useState, useEffect } from 'react';

const WeekPicker = ({ username, onWeekSelect }) => {
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);

    useEffect(() => {
        populateWeeks();
    }, []);

    useEffect(() => {
        // Automatically select the current week upon component mount
        if (weeks.length > 0) {
            const currentWeek = weeks.find(week => {
                const today = new Date();
                return week.startDate <= today && today <= week.endDate;
            });
            if (currentWeek) {
                setSelectedWeek(currentWeek);
                onWeekSelect(currentWeek);
            }
        }
    }, [weeks]);

    const populateWeeks = () => {
        const today = new Date();
        const currentWeekStart = getStartOfWeek(today);

        const weeksArray = [];

        for (let i = 0; i < 10; i++) {
            const startOfWeek = new Date(currentWeekStart);
            startOfWeek.setDate(currentWeekStart.getDate() + i * 7);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const weekNumber = getWeekNumber(startOfWeek);

            weeksArray.push({
                weekNumber,
                startDate: startOfWeek,
                endDate: endOfWeek,
            });
        }

        setWeeks(weeksArray);
    };

    const getStartOfWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day;
        return new Date(date.setDate(diff));
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
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'left',
                        flex: '1',
                        padding: '20px'
                    }}
                >
                    Week {week.weekNumber} ({week.startDate.toLocaleDateString()} - {week.endDate.toLocaleDateString()})
                </div>
            ))}
        </div>
    );
};

export default WeekPicker;
