import React, { useState, useEffect } from 'react';
import WeekPicker from './WeekPicker';
import AvailabilityPicker from './AvailabilityPicker';
import '../styles/MySchedule.css'

const MySchedule = ({ username }) => {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [availability, setAvailability] = useState(null);

    const fetchAvailability = async (username, weekNumber) => {
        try {
            const response = await fetch(`http://localhost:5000/availability/${username}/${weekNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAvailability(data);
            } else {
                console.error('Failed to fetch availability');
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const handleAvailabilitySubmit = async (availabilityData) => {
        try {
            const response = await fetch('http://localhost:5000/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    week: selectedWeek.weekNumber,
                    availability: availabilityData,
                }),
            });

            if (response.ok) {
                console.log('Availability saved successfully');
            } else {
                console.error('Failed to save availability');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleWeekSelect = (week) => {
        setSelectedWeek(week);
        fetchAvailability(username, week.weekNumber);
    };

    return (
        <div id="mySchedule">
            <div id="availabilityContainer" style={{ display: 'flex', flexDirection: 'row' }}>
                <div id="availabilityPickerContainer" style={{ flexGrow: 1 }}>
                    {selectedWeek && (
                        <AvailabilityPicker
                            username={username}
                            week={selectedWeek}
                            availability={availability}
                            onAvailabilitySubmit={handleAvailabilitySubmit}
                        />
                    )}
                </div>
                <div id="weeksList" className="week-buttons">
                    <WeekPicker onWeekSelect={handleWeekSelect} />
                </div>
            </div>
        </div>
    );
};

export default MySchedule;
