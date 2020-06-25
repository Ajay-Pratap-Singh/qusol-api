const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const publicProfileSchema = new mongoose.Schema({
    uid: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    diplayName: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    profileImageUrl: {
        type: String,
        default: ""////put default profile image file url
    }
});

module.exports = publicProfileSchema;