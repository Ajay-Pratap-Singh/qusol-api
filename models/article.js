const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId;
const userPublicProfile = require('./userPublicProfile');

const articleSchema = new mongoose.Schema({
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

const Article = mongoose.model('Article', articleSchema);

module.exports=Article;