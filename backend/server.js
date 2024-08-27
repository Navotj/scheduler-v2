const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const availabilityRoutes = require('./routes/availability.js');
const gameRoutes = require('./routes/games'); // Add game routes

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Make sure this matches your frontend's URL
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

const port = process.env.PORT || 5000;
const saltRounds = 10;
const jwtSecret = '9e0274ce3e08ef40f347bdce8d9ccbae19de135972384a164d4a0fa09108f13a7156326849ff324b6edcc2124891db0f9c70ca6c4d316bcc359a64b23dea706d';  // Replace with your own secret

app.use(bodyParser.json());

// Mount routes
app.use('/availability', availabilityRoutes);
app.use('/games', gameRoutes); // Use the game routes

// MongoDB connection to the "scheduler" database
mongoose.connect('mongodb://localhost:27017/scheduler', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

// Define the user schema and ensure it's stored in the "users" collection
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

// Sign Up Route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Error signing up user');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid username or password');
        }

        const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
