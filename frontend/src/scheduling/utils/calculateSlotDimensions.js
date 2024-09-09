const calculateSlotDimensions = () => {
    const tableWrapper = document.querySelector('.scheduler-table-wrapper');

    if (tableWrapper) {
        const wrapperWidth = tableWrapper.clientWidth;
        const daySlotWidth = 160;  // Adjust based on your design
        const scrollbarWidth = tableWrapper.offsetWidth - tableWrapper.clientWidth;
        const availableWidth = wrapperWidth - daySlotWidth - scrollbarWidth - 15;
        const numberOfTimeSlots = 49;  // Number of half-hour slots per day
        const timeSlotWidth = availableWidth / numberOfTimeSlots;

        document.documentElement.style.setProperty('--TimeSlotWidth', `${timeSlotWidth}px`);
    }
};

export default calculateSlotDimensions;
