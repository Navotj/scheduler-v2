const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const availabilityRoutes = require('./routes/availability.js');
const gameRoutes = require('./routes/gameRoutes.js'); // Game routes
const groupRoutes = require('./routes/groupRoutes.js'); // Group routes
const userRoutes = require('./routes/userRoutes'); // User routes

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Make sure this matches your frontend's URL
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Mount routes
app.use('/availability', availabilityRoutes);
app.use('/games', gameRoutes); // Use the game routes
app.use('/groups', groupRoutes); // Use the group routes
app.use('/users', userRoutes); // Use the user routes

// MongoDB connection to the "scheduler" database
mongoose.connect('mongodb://localhost:27017/scheduler', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
