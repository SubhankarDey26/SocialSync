const mongoose=require("mongoose")


async function connectToDB(){
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB is connected to Server")
}

module.exports=connectToDB