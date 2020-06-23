const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId;
const userPublicProfile = require('./userPublicProfile');

const ansSchema = new mongoose.Schema({
    author:userPublicProfile,
    body:{
        type:String,
        required:true
    },
    question:{
        type:ObjectId,
        ref:'Question'
    },
    isAnonymous:{
        type:Boolean,
        default:false
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

const Answer = mongoose.model('Answer', ansSchema);

module.exports=Answer;