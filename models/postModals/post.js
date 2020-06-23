const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.ObjectId;

//these are posts for blogs we will be keeping everthing separate

const postSchema = new mongoose.Schema({
    uid:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
    },
    body:{
        type:String,
        required:true
    },
    blogid:{
        type:ObjectId,
        ref:'Blog'
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