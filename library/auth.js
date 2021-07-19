const jwt=require("jsonwebtoken");

async function auth(req,res,next){
    try {
        const token= req.headers['authorization'];
        const dataId =await jwt.verify(token,process.env.KEY);
        req.userId= dataId.userId;
        next()
    } catch (error) {
        res.json(error)
    }
}

module.exports=auth;