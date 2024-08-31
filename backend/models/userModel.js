const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    telegramId: {
        type: String,
        required: true
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
        type: Number
    }
}, {
    timestamp: true
})

const user = mongoose.model('User', userSchema, 'telegramUsers');

module.exports = user;