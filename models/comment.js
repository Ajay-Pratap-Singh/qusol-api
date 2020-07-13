const mongoose = require('mongoose');
const userPublicProfile = require('./userPublicProfile');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    author:userPublicProfile,
    parentType:{
        type:String,
        required:true
    },
    pid:{
        type:ObjectId
    },
    body:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    upvoteCount: {
        type:Number,
        default:0
    },
    downvoteCount: {
        type:Number,
        default:0
    },
}, {
    timestamps:true
});

commentSchema.methods.toJSON = function () {
    const comment = this
    const commentObject = comment.toObject()
    delete commentObject.isDeleted
    return userObject
}

const Comment = mongoose.model('Comment', commentSchema);

module.exports=Comment;