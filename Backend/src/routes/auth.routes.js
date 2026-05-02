const express=require("express")
const authRouter=express.Router()
const authController=require("../controllers/auth.controllers")
const IdentifyUser=require("../middlewares/auth.middleware")


authRouter.post("/register",authController.registerController)

authRouter.post("/login",authController.logincontroller)

authRouter.get("/get-me",IdentifyUser,authController.getMeController)

module.exports=authRouter