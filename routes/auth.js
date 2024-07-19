const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// POST /api/signup - Register a new user
router.post('/signup', async (req, res) => {
    try {
        const { phoneNumber, email, name, password, dateOfBirth, monthlySalary } = req.body;

        // Calculate age from date of birth for validation
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Validate age and salary
        if (age <= 20) {
            return res.status(400).json({ message: 'Application rejected. User must be above 20 years old.' });
        }

        if (monthlySalary < 25000) {
            return res.status(400).json({ message: 'Application rejected. Monthly salary must be at least 25,000.' });
        }

        // Create a new user object and save it to the database
        const user = new User({
            phoneNumber,
            email,
            name,
            password,
            dateOfBirth,
            monthlySalary,
            status: 'approved', // Set status to approved by default, since there is no approval process
            purchasePowerAmount: monthlySalary * 2, // Set initial purchase power to be twice the monthly salary
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// POST /api/login - Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare the password entered with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If the password is invalid, return an error
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a jwt token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'User logged in successfully', jwt_token: token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;