const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// GET /api/user - Get user details
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

// POST /api/user/borrow - Borrow money
router.post('/borrow', auth, async (req, res) => {
    try {
        const { amount, tenureMonths } = req.body;
        const user = await User.findById(req.userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has enough purchase power
        if (amount > user.purchasePowerAmount) {
            return res.status(400).json({ message: 'Requested amount exceeds available purchase power' });
        }

        // Calculate repayment details
        const interestRate = 0.08; // 8% annual interest rate
        const monthlyInterestRate = interestRate / 12;
        const monthlyRepayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);

        // Update purchase power
        user.purchasePowerAmount -= amount;
        await user.save();

        // Send response with updated purchase power and repayment details
        res.json({
            updatedPurchasePower: user.purchasePowerAmount,
            monthlyRepayment: monthlyRepayment.toFixed(2),
            tenure: tenureMonths,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing borrow request', error: error.message });
    }
});

module.exports = router;