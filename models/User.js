const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    insert: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Transactions', transactionSchema);