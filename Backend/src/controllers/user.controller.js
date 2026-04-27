const FollowModel = require("../models/Follow.model")
const UserModel = require("../models/user.model")

async function followUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    // ✅ check user in User collection
    const isFolloweeExist = await UserModel.findOne({
        username: followeeUsername
    })

    if (!isFolloweeExist) {
        return res.status(404).json({
            message: "User you are trying to follow does not exist"
        })
    }

    if (followeeUsername === followerUsername) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        })
    }

    const isAlreadyFollowing = await FollowModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (isAlreadyFollowing) {
        return res.status(200).json({
            message: `You are already following ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const followRecord = await FollowModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(201).json({
        message: `You are now following ${followeeUsername}`,
        follow: followRecord
    })
}

async function UnfollowUserController(req,res){
    const followerUsername=req.user.username
    const followeeUsername=req.params.username 

    const isUserFollowing =await FollowModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(!isUserFollowing)
    {
        return res.status(200).json({
            message:`You are not Following ${followeeUsername}`
        })
    }

    await FollowModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message:`You have unfollowed ${followeeUsername}`
    })
}

module.exports={followUserController,UnfollowUserController}