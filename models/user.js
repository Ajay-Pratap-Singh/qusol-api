const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    },
    isDeleted: Boolean,
    isVerified: Boolean,
    displayname: String,
    coverImageUrl: {
        type: String

    },
    profileImageUrl: {
        type: String,
        default: "https://image.flaticon.com/icons/svg/2922/2922506.svg"
    },
    bio: String,
    contact: {
        country_code: String,
        phone_number: String
    },
    location: {
        type: String
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
    skills: [String]
},
    {
        timestamps: true
    })

userSchema.methods.toJSON = function () {
    const user = this
    const usersObject = user.toObject()

    return {
        uid: userObject._id,
        username: userObject.username,
        email: usersObject.email,
        displayname: userObject.displayname,
        coverImageUrl: userObject.coverImageUrl,
        profileImageUrl: userObject.profileImageUrl,
        bio: userObject.bio,
        location: userObject.location,
        interests: userObject.interests,
        skills: userObject.skills,
        createdAt: userObject.createdAt,
        updatedAt: userObject.updatedAt
    }
}

userSchema.pre('save', function (next) {
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
userSchema.methods.generateAuthToken = function () {
    let user = this
    console.log(process.env.SECRET)
    let token = jwt.sign(
        { username: user.username, uid: user._id.toString(), displayname: user.displayname, profileImageUrl: user.profileImageUrl },
        process.env.SECRET,
        { expiresIn: '7 days' }
    )
    return token
}

module.exports = mongoose.model('User', userSchema) 