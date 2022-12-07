const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
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

userSchema.methods.cleanup = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        insert: this.insert
    }
}

module.exports = mongoose.model('User', userSchema);