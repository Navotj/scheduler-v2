const condenseTimeSlots = (slots) => {
    if (slots.length === 0) return [];

    const sortedSlots = slots.sort((a, b) => {
        const [aDay, aTime] = a.split('-').map(Number);
        const [bDay, bTime] = b.split('-').map(Number);
        return aDay - bDay || aTime - bTime;
    });

    const condensed = [];
    let currentRange = null;

    sortedSlots.forEach(slot => {
        const [dayIndex, timeIndex] = slot.split('-').map(Number);
        const { startDate, endDate } = generateTimeSlot(dayIndex, timeIndex);

        if (currentRange) {
            if (startDate <= currentRange.endDate + 1000 * 60 * 30) {
                currentRange.endDate = Math.max(currentRange.endDate, endDate);
            } else {
                condensed.push(currentRange);
                currentRange = { startDate, endDate };
            }
        } else {
            currentRange = { startDate, endDate };
        }
    });

    if (currentRange) {
        condensed.push(currentRange);
    }

    return condensed;
};

const generateTimeSlot = (dayIndex, timeIndex) => {
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);
    startTime.setDate(startTime.getDate() + dayIndex);
    startTime.setMinutes(timeIndex * 30);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 30);
    endTime.setSeconds(endTime.getSeconds() - 1);

    return {
        startDate: startTime.getTime(),
        endDate: endTime.getTime(),
    };
};

export default {
    condenseTimeSlots,
    generateTimeSlot,
};
