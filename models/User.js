const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
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

// userSchema.pre("save", function (next) {
//     const user = this
//     if (this.isModified("password") || this.isNew) {
//       bcrypt.genSalt(10, function (saltError, salt) {
//         if (saltError) {
//           return next(saltError)
//         } else {
//           bcrypt.hash(user.password, salt, function(hashError, hash) {
//             if (hashError) {
//               return next(hashError)
//             }
  
//             user.password = hash
//             next()
//           })
//         }
//       })
//     } else {
//       return next()
//     }
//   })

// // pre update middleware to hash password if password is modified
// userSchema.pre("updateOne", function (next) {
//   const password = this.getUpdate().password
//   if (password) {
//     bcrypt.genSalt(10, function (saltError, salt) {
//       if (saltError) {
//         return next(saltError)
//       } else {
//         bcrypt.hash(password, salt, function (hashError, hash) {
//           if (hashError) {
//             return next(hashError)
//           }

//           this.getUpdate().password = hash
//           next()
//         })
//       }
//     })
//   } else {
//     return next()
//   }
// })

// // compare password
// userSchema.methods.comparePassword = function (password, cb) {
//   bcrypt.compare(password, this.password, function (err, isMatch) {
//     if (err) {
//       return cb(err)
//     }
//     cb(null, isMatch)
//   })
// }

module.exports = mongoose.model('User', userSchema);