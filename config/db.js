const mongoose=require("mongoose");

const connectDB= async()=>{
    try {
        const db= await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log(`mongoose ${db.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports=connectDB;