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

ansSchema.methods.toJSON = function () {
    const ans = this
    const ansObject = ans.toObject()

    delete ansObject.isDeleted
    if(ansObject.isAnonymous)
        delete ansObject.author
    delete ansObject.isAnonymous

    return userObject
}

const Answer = mongoose.model('Answer', ansSchema);

module.exports=Answer;