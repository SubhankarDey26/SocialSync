const express=require("express")
const postController=require("../controllers/post.controller")
const multer=require("multer")
const postRouter=express.Router()
const IdentifyUser=require("../middlewares/auth.middleware")

const upload=multer({storage:multer.memoryStorage()})


postRouter.post("/",upload.single("image"),IdentifyUser,postController.createPostController)

postRouter.get("/",IdentifyUser,postController.getPostController)

postRouter.get("/details/:postId",IdentifyUser,postController.getPostDetails)


postRouter.post("/like/:postId",IdentifyUser,postController.LikePostController)

module.exports=postRouter