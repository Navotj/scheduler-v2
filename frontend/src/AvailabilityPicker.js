// Updated AvailabilityPicker.js

import React, { useState, useEffect } from 'react';

const AvailabilityPicker = ({ week, onAvailabilitySubmit }) => {
    const [availability, setAvailability] = useState([]);

    useEffect(() => {
        const initializeAvailability = () => {
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const hoursInDay = 24;

            const initialAvailability = daysOfWeek.map(() =>
                Array(hoursInDay).fill(false)
            );

            setAvailability(initialAvailability);
        };

        initializeAvailability();
    }, [week]);

    const toggleSlot = (dayIndex, slotIndex) => {
        const newAvailability = availability.map((day, dIndex) =>
            day.map((slot, sIndex) =>
                dIndex === dayIndex && sIndex === slotIndex ? !slot : slot
            )
        );

        setAvailability(newAvailability);
    };

    const handleSubmit = () => {
        onAvailabilitySubmit(availability);
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeSlots = Array(24).fill(null).map((_, i) => `${i.toString().padStart(2, '0')}`);
    const weekStartDate = new Date(week.startDate); // Assuming week.startDate is available

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {timeSlots.map((time, index) => (
                            <th key={index} className="timeLabel">{time}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {availability.map((day, dayIndex) => {
                        const currentDate = new Date(weekStartDate);
                        currentDate.setDate(weekStartDate.getDate() + dayIndex);
                        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
                        return (
                            <tr key={dayIndex}>
                                <td className="dayLabel">{daysOfWeek[dayIndex]} | {formattedDate}</td>
                                {day.map((slot, slotIndex) => (
                                    <td
                                        key={slotIndex}
                                        className={`slot ${slot ? 'clicked' : ''}`}
                                        onClick={() => toggleSlot(dayIndex, slotIndex)}
                                    />
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={handleSubmit}>Submit Availability</button>
        </div>
    );
};

export default AvailabilityPicker;
