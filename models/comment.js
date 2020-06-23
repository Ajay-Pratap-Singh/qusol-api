const mongoose = require('mongoose');
const userPublicProfile = require('./userPublicProfile');

const commentSchema = new mongoose.Schema({
    author:userPublicProfile,
    on:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    upvotes:[
        userPublicProfile,{
            timestamps:true
        }
    ],
    downvotes:[
        userPublicProfile,{
            timestamps:true
        }
    ]
}, {
    timestamps:true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports=Comment;