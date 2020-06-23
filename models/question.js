const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId;
const userPublicProfile = require('./userPublicProfile');

const quesSchema = new mongoose.Schema({
    author:userPublicProfile,
    body:{
        type:String,
        required:true
    },
    answers:[
        {
            type:ObjectId,
            ref:'Answer'
        }
    ],
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
    ],
    tags:[
        {
            tagid:{
                type:ObjectId,
                ref:'Tag'
            },
            text:{
                type:String
            }
        }
    ],
    categories:[
        {
            catid:{
                type:ObjectId,
                ref:'Category'
            },
            name:{
                type:String
            }
        }
    ]
}, {
    timestamps:true
});

const Question = mongoose.model('Question', quesSchema);

module.exports=Question;