const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    name:String,
    email:String,
    contact:Number,
    password:String,
    verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const user= mongoose.model("user",userSchema);

module.exports=user;