const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const dburl = process.env.DB_URL;
const app = express();
const port = 3000;

// Connecting to MongoDB
mongoose.connect(dburl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use(express.json());


// Defining routes
// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Use routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});