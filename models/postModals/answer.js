const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.ObjectId;

const ansSchema = new mongoose.Schema({
    uid:{
        type:ObjectId,
        ref:'User',
        required:true
    },
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

const Answer = mongoose.model('Answer', ansSchema);

module.exports=Answer;