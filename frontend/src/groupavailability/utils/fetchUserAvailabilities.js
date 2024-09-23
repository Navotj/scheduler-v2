// File: src/utils/fetchUserAvailabilities.js

import axios from 'axios';

const fetchUserAvailabilities = async (usernames) => {
  try {
    const response = await axios.post('http://localhost:5000/availability/multiple', { usernames });
    return response.data; // This will be an array of availabilities
  } catch (error) {
    console.error('Error fetching user availabilities:', error);
    return [];
  }
};

export default fetchUserAvailabilities;
