const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const userPublicProfile = require('./userPublicProfile');

const quesSchema = new mongoose.Schema({
    author: userPublicProfile,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    answers: [
        {
            type: ObjectId,
            ref: 'Answer'
        }
    ],
    isAnonymous: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    upvotes: [
        userPublicProfile,
        {
            timestamps: true
        }
    ],
    downvotes: [
        userPublicProfile,
        {
            timestamps: true
        }
    ],
    tags: [
        String
    ],
    categories: [
        {
            catid: {
                type: ObjectId,
                ref: 'Category'
            },
            name: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
});


quesSchema.methods.toJSON = function () {
    let ques = this
    let quesObject = ques.toObject()
    return {
        author: quesObject.author,
        _id: quesObject._id,
        isAnonymous: quesObject.isAnonymous,
        title: quesObject.title,
        description: quesObject.description,
        tags: quesObject.tags,
        categories: quesObject.categories
    }
}

const Question = mongoose.model('Question', quesSchema);

module.exports = Question;