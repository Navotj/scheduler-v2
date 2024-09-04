import { useState } from 'react';
import slotUtils from '../utils/slotUtils';

const useScheduleFetching = ({ username, selectedSlots, onAvailabilitySubmit }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const times = slotUtils.condenseTimeSlots(Array.from(selectedSlots));
        const scheduleData = {
            username,
            times: times.map(({ startDate, endDate }) => ({ startDate, endDate })),
        };

        try {
            const response = await fetch('http://localhost:5000/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            });
            if (response.ok) {
                setIsSaving(false);
                onAvailabilitySubmit();
            } else {
                setIsSaving(false);
            }
        } catch (error) {
            setIsSaving(false);
        }
    };

    return { isSaving, handleSave };
};

export default useScheduleFetching;
