const mongoose=require("mongoose")


const userSchema=new mongoose.Schema({
    username:{
    type:String,
    unique:[true,"Username Already Exist"],
    require:[true,"Username is Required"]
    },
    email:{
        type:String,
        unique:[true,"Email Already Exist"],
        required:[true,"Email is rquired"]
    },
    password:{
        type:String,
        required:[true,"Password is rquired"],
        select:false
    },
    bio:String,
    ProfileImage:{
        type:String,
        default:"https://ik.imagekit.io/ag09ehtgk/default%20user.jpg?updatedAt=1771508602666"
    }

})


const userModel=mongoose.model("users",userSchema)

module.exports=userModel