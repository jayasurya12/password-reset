const express=require("express");
const router=require("./routers/api")
const dotenv=require("dotenv");
const db=require("./config/db");
const bodyparser= require("body-parser");

dotenv.config({path:"./config/dot.env"})
const app=express();
app.use(express.json())

app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static("styles"))
app.use(express.static("images"))
app.use(express.static("password_check"))

db();
app.get("/",(req,res)=>{
    res.send("it is working")
})


app.use("/router",router);

app.listen(process.env.PORT || 5000,()=>{
    console.log("server started")
})