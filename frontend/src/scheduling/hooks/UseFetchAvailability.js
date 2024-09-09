import { useEffect } from 'react';

const useFetchAvailability = ({ username, setSelectedSlots }) => {
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:5000/availability?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          markSlots(data.times);
        } else {
          console.log('Failed to fetch availability');
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    const markSlots = (times) => {
      const newSelectedSlots = new Set();
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      times.forEach(({ startDate, endDate }) => {
        let start = new Date(startDate);
        let end = new Date(endDate);

        // Skip slots that end before today
        if (end < startOfToday) return;

        // Adjust the start date if it is before today
        if (start < startOfToday) {
          start = startOfToday;
        }

        let startDayIndex = Math.floor((start - startOfToday) / (1000 * 60 * 60 * 24));
        let endDayIndex = Math.floor((end - startOfToday) / (1000 * 60 * 60 * 24));

        let startTimeIndex = Math.floor(start.getHours() * 2 + start.getMinutes() / 30);
        let endTimeIndex = Math.ceil(end.getHours() * 2 + end.getMinutes() / 30);

        for (let day = startDayIndex; day <= endDayIndex; day++) {
          let timeStart = (day === startDayIndex) ? startTimeIndex : 0;
          let timeEnd = (day === endDayIndex) ? endTimeIndex : 48;

          for (let timeIndex = timeStart; timeIndex < timeEnd; timeIndex++) {
            newSelectedSlots.add(`${day}-${timeIndex}`);
          }
        }
      });

      setSelectedSlots(newSelectedSlots);
    };

    fetchAvailability();
  }, [username, setSelectedSlots]);
};

export default useFetchAvailability;
