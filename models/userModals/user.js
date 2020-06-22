const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true
    },
    isDeleted: Boolean,
    isVerified: Boolean
}, {
    timestamps: true
})

UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next();
            })
        })
    } else {
        next();
    }

})


// token generation
UserSchema.methods.generateAuthToken = function () {
    let user = this
    let token = jwt.sign(
        { username: user.username, _id: user._id.toString() },
        process.env.SECRET,
        { expiresIn: '1h' }
    )
    return token
}



module.exports = mongoose.model('User', UserSchema) 
