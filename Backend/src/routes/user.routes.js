const express = require("express")
const multer = require("multer")
const userController = require("../controllers/user.controller")
const IdentifyUser = require("../middlewares/auth.middleware")

const upload = multer({ storage: multer.memoryStorage() })
const userRouter = express.Router()

userRouter.post("/follow/:username", IdentifyUser, userController.followUserController)

userRouter.post("/unfollow/:username", IdentifyUser, userController.UnfollowUserController)

userRouter.put("/profile", upload.single("profileImage"), IdentifyUser, userController.updateProfileController)

userRouter.get("/follow-requests", IdentifyUser, userController.getFollowRequestsController)

userRouter.post("/follow-requests/:requestId/accept", IdentifyUser, userController.acceptFollowRequestController)

userRouter.post("/follow-requests/:requestId/reject", IdentifyUser, userController.rejectFollowRequestController)

userRouter.get("/followers", IdentifyUser, userController.getFollowersController)

userRouter.get("/following", IdentifyUser, userController.getFollowingController)

module.exports = userRouter