const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
    ////shall we keep an array of material --- for referencing from this side???
}, {
    timestamps:true
});

const Category = mongoose.model('Category', catSchema);

module.exports=Category;