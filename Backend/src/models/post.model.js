const mongoose =require("mongoose")


const postSchema=new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgUrl:{
        type:String,
        required:[true,"img_url is required for creating a post"]
    },
    user:{
        ref:"users",
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"UserId is Required for creating a post"]
    }
})


const postModel=mongoose.model("posts",postSchema)
module.exports=postModel