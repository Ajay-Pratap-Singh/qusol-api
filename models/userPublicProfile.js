const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const publicProfileSchema = new mongoose.Schema({
    uid:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    diplayName:{
        type:String,
        trim:true
    },
    userName:{
        type:String,
        trim:true
    },
    profileImageUrl:{
        type:String,
        default:""////put default profile image file url
    }
},{
    _id:false
});

module.exports = publicProfileSchema;