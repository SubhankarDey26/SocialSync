const express=require("express")
const userController=require("../controllers/user.controller")
const IdentifyUser=require("../middlewares/auth.middleware")

const userRouter=express.Router()


userRouter.post("/follow/:username",IdentifyUser,userController.followUserController)

userRouter.post("/unfollow/:username",IdentifyUser,userController.UnfollowUserController)

module.exports=userRouter