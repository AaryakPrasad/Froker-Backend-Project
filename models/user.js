const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    dateOfRegistration: { type: Date, default: Date.now },
    dateOfBirth: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    purchasePowerAmount: { type: Number, default: 0 },
});

// Hash the password using Bcrypt before saving the user to the database using a pre-save hook (middleware) in Mongoose
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);