const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

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
    imgThumbUrl:{
        type:String,
        default:""//enter default user thumbnail when no profile picture given
    }
});

module.exports = publicProfileSchema;