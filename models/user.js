const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
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
    },
    isDeleted: Boolean,
    isVerified: Boolean,
    displayName: String,
    coverImageUrl: String,
    profileImageUrl: String,
    bio: String,
    contact: {
        country_code: String,
        phone_number: String
    },
    address: {
        country: String,
        city: String,
        zipcode: Number,
        address_line: String,
    },
    education: [
        {
            school: String,
            degree: String,
            area_of_study: String,
            from: String,
            to: String,
            current: Boolean,
            description: String,
        }
    ],
    employement: [
        {
            title: String,
            company: String,
            location: String,
            role: String,
            from: String,
            to: String,
            current: Boolean,
            description: String,
        }
    ],
    interests: [String],
    skills: [String]}, 
    {
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

module.exports = mongoose.model('User', userSchema) 