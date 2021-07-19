const router=require("express").Router()
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const userModel=require("../../../models");
const nodemailer=require("nodemailer")
const {auth}=require("../../../library")

router.post("/signup",async(req,res)=>{
    try {
        const pass= await bcrypt.hash(req.body.password,10);
        req.body.password=pass;

        const user= await userModel(req.body);
        console.log(user)
        await user.save()

////////////////////////////---jwt---token------////////////////////////////////
    const token= await jwt.sign({userId:user._id},process.env.KEY);
    const emailVerficationTransport= nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service:"gmail",
        secure:true,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    })
     emailVerficationTransport.sendMail(
        {
        from:process.env.EMAIL,
        to:user.email,
        subject:"HI this is verification",
        html:`<div>
            <h2>hi this email- verification</h2>
            <a href="https://passwordreset-1.heroku.com/router/verify/${token}">click me</a>
            </div>`
    },
    (error,data)=>{
        if(error){
            console.log(error)
        }else{
            console.log(data.response)
        }
    }
    )
    
    res.json("verification msg sended")
    } catch (error) {
        res.json({msg:error})
    }
})

router.post("/login",async(req,res)=>{
    try {
        const userEmail= await userModel.findOne({email:req.body.email})
       
        if(!userEmail.verified){
            return res.json("email verification not verified")
        }
        const userPass= await bcrypt.compare(req.body.password,userEmail.password);
        if(userPass){
            const token= await jwt.sign({userId:userEmail._id},process.env.KEY);
            return res.json(token)
        }else{
            res.json({mag:"wrong password"})
        }   
    } catch (error) {
        res.json({msg:error})
    }
})

router.post("/forget",async(req,res)=>{
    try {
        const user= await userModel.findOne({email:req.body.email})
        if(user){
            if(!user.verified){
                res.json("user not verified")
            }else{
                const passwordMatch= await bcrypt.compare(req.body.password,user.password);
                if(passwordMatch){
                    const token= await jwt.sign({userId:user._id},process.env.KEY)
                    
                    const transport= nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        service:"gmail",
                        secure:true,
                        auth:{
                            user:process.env.EMAIL,
                            pass:process.env.PASSWORD
                        },
                        tls: {
                            // do not fail on invalid certs
                            rejectUnauthorized: false
                        }
                    })
                    transport.sendMail({
                        from:process.env.EMAIL,
                        to:req.body.email,
                        subject:"this is password reset",
                        html:`<div><a href="https://passwordreset-1.heroku.com/router/forget/${token}">click me</a></div>`
                    })
                }else{
                    res.json("wrong password")
                }
               
            }
        }else{
           return res.json("user not found")
        }
        res.json("msg sending")
    } catch (error) {
        res.json(error)
    }
})

router.get("/forget/:token",async(req,res)=>{
    try {
        const tokenId= await jwt.verify(req.params.token,process.env.KEY)
    if(tokenId){
        res.render("index",{token:req.params.token})
    }
    } catch (error) {
        res.json(error)
    }
    
})

router.post("/reset/:token",async(req,res)=>{
    try {
        const tokenId=await jwt.verify(req.params.token,process.env.KEY);
        console.log(tokenId)
        const hashNewPass=await bcrypt.hash(req.body.newpass,10);
        
        const user= await userModel
        .findByIdAndUpdate(
            {_id:tokenId.userId},
            {password:hashNewPass}
        )
        res.render("success")
    } catch (error) {
        res.json(error)
    }
})

router.get("/data",auth,async(req,res)=>{
    try {
        const userData= await userModel.findById({_id:req.userId});
        console.log(userData)
        res.json(userData)
    } catch (error) {
        res.json({msg:error})
    }
})

router.get("/verify/:token",async(req,res)=>{
    try {
        const tokendata= await jwt.verify(req.params.token,process.env.KEY)
        const data=await userModel.findByIdAndUpdate({_id:tokendata.userId},{verified:true});
        res.json("verified successfull")
    } catch (error) {
        res.json({msg:error})
    }
})

module.exports=router;
