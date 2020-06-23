const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
        unique:true
    }
    ////shall we keep an array of material --- for referencing from this side???
}, {
    timestamps:true
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports=Tag;