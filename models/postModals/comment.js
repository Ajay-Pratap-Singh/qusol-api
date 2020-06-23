const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.ObjectId;
const userPublicProfile = require('./userPublicProfile');

//these are posts for blogs we will be keeping everthing separate

const commentSchema = new mongoose.Schema({
    by:userPublicProfile,
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
        {
            uid:{
                type:ObjectId,
                ref:'User',
                unique:true
            },
            displayName:{
                type:String,
                trim:true
            }
        },{
            timestamps:true
        }
    ],
    downvotes:[
        {
            uid:{
                type:ObjectId,
                ref:'User',
                unique:true
            },
            displayName:{
                type:String,
                trim:true
            }
        },{
            timestamps:true
        }
    ]
    //comments:[]    Do You want to cross reference root comments (array of commentIDs) here???
}, {
    timestamps:true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports=Comment;