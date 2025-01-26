const { text } = require("express");
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        required:true
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);