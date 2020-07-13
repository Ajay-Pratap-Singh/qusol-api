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
    bestAnswer: {
        author: userPublicProfile,
        body: String,
        questionId: {
            type: ObjectId,
            ref: 'Question'
        },
        upvoteCount: Number,
        downvoteCount: Number,
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    upvoteCount: {
        type:Number,
        default:0
    },
    downvoteCount: {
        type:Number,
        default:0
    },
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
    delete quesObject.isDeleted
    if(quesObject.isAnonymous)
        delete quesObject.author
    delete quesObject.isAnonymous
    return quesObject
}

const Question = mongoose.model('Question', quesSchema);

module.exports = Question;