const express = require("express")
const multer = require("multer")
const userController = require("../controllers/user.controller")
const IdentifyUser = require("../middlewares/auth.middleware")

const upload = multer({ storage: multer.memoryStorage() })
const userRouter = express.Router()

userRouter.post("/follow/:username", IdentifyUser, userController.followUserController)

userRouter.post("/unfollow/:username", IdentifyUser, userController.UnfollowUserController)

userRouter.put("/profile", upload.single("profileImage"), IdentifyUser, userController.updateProfileController)

module.exports = userRouter