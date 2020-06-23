// to dos
// 1 make a model
const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.ObjectId;

const quesSchema = new mongoose.Schema({
    uid:{
        type:ObjectId,
        ref:'User',
        required:true
    },
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
        }
    ],
    //comments:[]    Do You want to cross reference root comments(array of commentIDs) here???
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