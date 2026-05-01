const bcrypt = require("bcryptjs")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const FollowModel = require("../models/follow.model")
const UserModel = require("../models/user.model")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function followUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

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

    const existingRequest = await FollowModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (existingRequest) {
        if (existingRequest.status === 'accepted') {
            return res.status(200).json({
                message: `You are already following ${followeeUsername}`,
                follow: existingRequest
            })
        } else if (existingRequest.status === 'pending') {
            return res.status(200).json({
                message: `Follow request already sent to ${followeeUsername}`,
                follow: existingRequest
            })
        } else if (existingRequest.status === 'rejected') {
            // Allow resending request if previously rejected
            existingRequest.status = 'pending'
            await existingRequest.save()
            return res.status(200).json({
                message: `Follow request sent to ${followeeUsername}`,
                follow: existingRequest
            })
        }
    }

    const followRecord = await FollowModel.create({
        follower: followerUsername,
        followee: followeeUsername,
        status: 'pending'
    })

    res.status(201).json({
        message: `Follow request sent to ${followeeUsername}`,
        follow: followRecord
    })
}

async function UnfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const followRecord = await FollowModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (!followRecord) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    if (followRecord.status === 'pending') {
        await FollowModel.findByIdAndDelete(followRecord._id)
        return res.status(200).json({
            message: `Follow request to ${followeeUsername} cancelled`
        })
    }

    await FollowModel.findByIdAndDelete(followRecord._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

async function updateProfileController(req, res) {
    const userId = req.user.id
    const { username, email, bio, password, profileImage } = req.body

    const updates = {
        ...(username && { username }),
        ...(email && { email }),
        ...(bio !== undefined && { bio }),
        ...(profileImage && { ProfileImage: profileImage })
    }

    try {
        if (req.file) {
            const file = await imagekit.files.upload({
                file: await toFile(Buffer.from(req.file.buffer), `profile-${userId}`),
                fileName: `profile-${userId}`,
                folder: "cohort-2-insta-clone-profiles"
            })
            updates.ProfileImage = file.url
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updates.password = hashedPassword
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profileImage: updatedUser.ProfileImage
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Username or email is already taken"
            })
        }
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function getFollowRequestsController(req, res) {
    const userId = req.user.id
    const user = await UserModel.findById(userId)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const followRequests = await FollowModel.find({
        followee: user.username,
        status: 'pending'
    }).populate('follower', 'username email ProfileImage bio')

    res.status(200).json({
        message: "Follow requests fetched successfully",
        requests: followRequests
    })
}

async function acceptFollowRequestController(req, res) {
    const userId = req.user.id
    const requestId = req.params.requestId
    const user = await UserModel.findById(userId)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const followRequest = await FollowModel.findById(requestId)

    if (!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    if (followRequest.followee !== user.username) {
        return res.status(403).json({
            message: "You can only respond to requests sent to you"
        })
    }

    if (followRequest.status !== 'pending') {
        return res.status(400).json({
            message: "Request has already been processed"
        })
    }

    followRequest.status = 'accepted'
    await followRequest.save()

    res.status(200).json({
        message: "Follow request accepted",
        follow: followRequest
    })
}

async function rejectFollowRequestController(req, res) {
    const userId = req.user.id
    const requestId = req.params.requestId
    const user = await UserModel.findById(userId)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const followRequest = await FollowModel.findById(requestId)

    if (!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    if (followRequest.followee !== user.username) {
        return res.status(403).json({
            message: "You can only respond to requests sent to you"
        })
    }

    if (followRequest.status !== 'pending') {
        return res.status(400).json({
            message: "Request has already been processed"
        })
    }

    followRequest.status = 'rejected'
    await followRequest.save()

    res.status(200).json({
        message: "Follow request rejected",
        follow: followRequest
    })
}

async function getFollowersController(req, res) {
    const userId = req.user.id
    const user = await UserModel.findById(userId)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const followers = await FollowModel.find({
        followee: user.username,
        status: 'accepted'
    }).populate('follower', 'username email ProfileImage bio')

    res.status(200).json({
        message: "Followers fetched successfully",
        followers: followers
    })
}

async function getFollowingController(req, res) {
    const userId = req.user.id
    const user = await UserModel.findById(userId)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const following = await FollowModel.find({
        follower: user.username,
        status: 'accepted'
    }).populate('followee', 'username email ProfileImage bio')

    res.status(200).json({
        message: "Following fetched successfully",
        following: following
    })
}

module.exports = { 
    followUserController, 
    UnfollowUserController, 
    updateProfileController,
    getFollowRequestsController,
    acceptFollowRequestController,
    rejectFollowRequestController,
    getFollowersController,
    getFollowingController
}