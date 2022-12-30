const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    plan: {
        type: String,
        default: "free"
    },
    insert: {
        type: Date,
        default: Date.now
    }
})

// only accept user or admin in role
userSchema.path("role").validate(function (value) {
  return /user|admin/.test(value)
}, "Invalid role, please enter user or admin")

// only accept free or premium in plan
userSchema.path("plan").validate(function (value) {
  return /free|premium/.test(value)
}, "Invalid plan, please enter free or premium")

userSchema.methods.cleanup = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        plan: this.plan,
        insert: this.insert
    }
}

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
});

module.exports = mongoose.model('User', userSchema);