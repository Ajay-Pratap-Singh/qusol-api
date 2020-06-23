const mongoose = require('mongoose');
const userPublicProfile = require('./userPublicProfile');

const postSchema = new mongoose.Schema({
    author:userPublicProfile,
    title:{
        type:String,
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
        userPublicProfile,
        {
            timestamps:true
        }
    ],
    downvotes:[
        userPublicProfile,
        {
            timestamps:true
        }
    ]
}, {
    timestamps:true
});

const Post  = mongoose.model('Post', postSchema);

module.exports=Post;