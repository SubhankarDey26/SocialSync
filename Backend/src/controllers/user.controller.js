const bcrypt = require("bcryptjs")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const FollowModel = require("../models/Follow.model")
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

async function UnfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await FollowModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message: `You are not Following ${followeeUsername}`
        })
    }

    await FollowModel.findByIdAndDelete(isUserFollowing._id)

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

module.exports = { followUserController, UnfollowUserController, updateProfileController }