const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.ObjectId;
const userPublicProfile = require('./userPublicProfile');

//these are posts for blogs we will be keeping everthing separate

const articleSchema = new mongoose.Schema({
    writtenBy:userPublicProfile,
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
    //comments:[]    Do You want to cross reference root comments (array of commentIDs) here???
}, {
    timestamps:true
});

const Article = mongoose.model('Article', articleSchema);

module.exports=Article;