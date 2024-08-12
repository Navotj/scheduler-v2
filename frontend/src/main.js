
import React, { useState } from 'react';
import WeekPicker from './WeekPicker';
import AvailabilityPicker from './AvailabilityPicker';
import './styles.css';

const Main = () => {
    const [username, setUsername] = useState('');
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [availability, setAvailability] = useState(null);

    const handleWeekSelect = (week) => {
        setSelectedWeek(week);
        fetchAvailability(username, week.weekNumber);
    };

    const fetchAvailability = async (username, weekNumber) => {
        try {
            const response = await fetch(`http://localhost:5000/availability/${username}/${weekNumber}`);
            const data = await response.json();
            setAvailability(data);
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

    return (
        <div>
            {!selectedWeek ? (
                <div id="usernamePrompt">
                    <input
                        type="text"
                        id="usernameInput"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={() => username && setSelectedWeek(true)}>Submit Username</button>
                </div>
            ) : (
                <div id="weeklyView">
                    <div id="weeksList">
                        <WeekPicker username={username} onWeekSelect={handleWeekSelect} />
                    </div>
                    <div id="availabilityPickerContainer">
                        {selectedWeek && (
                            <AvailabilityPicker
                                username={username}
                                week={selectedWeek}
                                onAvailabilitySubmit={handleAvailabilitySubmit}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;
