const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

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

router.post('/borrow', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (amount > user.purchasePowerAmount) {
            return res.status(400).json({ message: 'Requested amount exceeds available purchase power' });
        }

        // Calculate repayment details
        const interestRate = 0.08; // 8% annual interest rate
        const tenureMonths = 12; // Assuming a fixed tenure of 12 months
        const monthlyInterestRate = interestRate / 12;
        const monthlyRepayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);

        // Update purchase power
        user.purchasePowerAmount -= amount;
        await user.save();

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