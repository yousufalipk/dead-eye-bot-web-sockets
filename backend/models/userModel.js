const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
        unique: true // Ensures each telegramId is unique
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String
    },
    balance: {
        type: Number,
        default: 0 
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema, 'telegramUsers');

module.exports = User;
