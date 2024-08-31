const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    telegramId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String
    },
    balance: {
        type: Number
    }
}, {
    timestamp: true
})

const user = mongoose.model('User', userSchema, 'telegramUsers');

module.exports = user;