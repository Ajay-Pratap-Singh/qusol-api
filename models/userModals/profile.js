const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    full_name: String,
    cover_image: String,
    profile_image: String,
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
    skills: [String],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Profile', ProfileSchema) 
