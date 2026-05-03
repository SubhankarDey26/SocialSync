const bcrypt = require("bcryptjs");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const FollowModel = require("../models/follow.model");
const UserModel = require("../models/user.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Helper: given a list of usernames, returns a map { username -> userDoc }
async function buildUserMap(usernames) {
  const users = await UserModel.find({ username: { $in: usernames } });
  return users.reduce((acc, u) => {
    acc[u.username] = {
      username: u.username,
      email: u.email,
      ProfileImage: u.ProfileImage,
      bio: u.bio,
    };
    return acc;
  }, {});
}

async function followUserController(req, res) {
  try {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    const isFolloweeExist = await UserModel.findOne({ username: followeeUsername });
    if (!isFolloweeExist) {
      return res.status(404).json({ message: "User you are trying to follow does not exist" });
    }

    if (followeeUsername === followerUsername) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existingRequest = await FollowModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
    });

    if (existingRequest) {
      if (existingRequest.status === "accepted") {
        return res.status(200).json({
          message: `You are already following ${followeeUsername}`,
          follow: existingRequest,
        });
      } else if (existingRequest.status === "pending") {
        return res.status(200).json({
          message: `Follow request already sent to ${followeeUsername}`,
          follow: existingRequest,
        });
      } else if (existingRequest.status === "rejected") {
        existingRequest.status = "pending";
        await existingRequest.save();
        return res.status(200).json({
          message: `Follow request sent to ${followeeUsername}`,
          follow: existingRequest,
        });
      }
    }

    const followRecord = await FollowModel.create({
      follower: followerUsername,
      followee: followeeUsername,
      status: "pending",
    });

    res.status(201).json({
      message: `Follow request sent to ${followeeUsername}`,
      follow: followRecord,
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function UnfollowUserController(req, res) {
  try {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    const followRecord = await FollowModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
    });

    if (!followRecord) {
      return res.status(200).json({ message: `You are not following ${followeeUsername}` });
    }

    await FollowModel.findByIdAndDelete(followRecord._id);

    if (followRecord.status === "pending") {
      return res.status(200).json({ message: `Follow request to ${followeeUsername} cancelled` });
    }

    res.status(200).json({ message: `You have unfollowed ${followeeUsername}` });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProfileController(req, res) {
  try {
    const userId = req.user.id;
    const { username, email, bio, password } = req.body;

    const updates = {
      ...(username && { username }),
      ...(email && { email }),
      ...(bio !== undefined && { bio }),
    };

    if (req.file) {
      const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), `profile-${userId}`),
        fileName: `profile-${userId}`,
        folder: "cohort-2-insta-clone-profiles",
      });
      updates.ProfileImage = file.url;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profileImage: updatedUser.ProfileImage,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Username or email is already taken" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFollowRequestsController(req, res) {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const followRecords = await FollowModel.find({
      followee: user.username,
      status: "pending",
    });

    // follower field is a username string — manually look up the user docs
    const userMap = await buildUserMap(followRecords.map((f) => f.follower));

    const requests = followRecords.map((f) => ({
      _id: f._id,
      follower: userMap[f.follower] || { username: f.follower },
      followee: f.followee,
      status: f.status,
      createdAt: f.createdAt,
    }));

    res.status(200).json({ message: "Follow requests fetched successfully", requests });
  } catch (error) {
    console.error("GetFollowRequests error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function acceptFollowRequestController(req, res) {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const followRequest = await FollowModel.findById(requestId);
    if (!followRequest) return res.status(404).json({ message: "Follow request not found" });

    if (followRequest.followee !== user.username) {
      return res.status(403).json({ message: "You can only respond to requests sent to you" });
    }

    if (followRequest.status !== "pending") {
      return res.status(400).json({ message: "Request has already been processed" });
    }

    followRequest.status = "accepted";
    await followRequest.save();

    res.status(200).json({ message: "Follow request accepted", follow: followRequest });
  } catch (error) {
    console.error("AcceptFollowRequest error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function rejectFollowRequestController(req, res) {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const followRequest = await FollowModel.findById(requestId);
    if (!followRequest) return res.status(404).json({ message: "Follow request not found" });

    if (followRequest.followee !== user.username) {
      return res.status(403).json({ message: "You can only respond to requests sent to you" });
    }

    if (followRequest.status !== "pending") {
      return res.status(400).json({ message: "Request has already been processed" });
    }

    followRequest.status = "rejected";
    await followRequest.save();

    res.status(200).json({ message: "Follow request rejected", follow: followRequest });
  } catch (error) {
    console.error("RejectFollowRequest error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFollowersController(req, res) {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const followRecords = await FollowModel.find({
      followee: user.username,
      status: "accepted",
    });

    // follower is a username string — manually look up user docs
    const userMap = await buildUserMap(followRecords.map((f) => f.follower));

    const followers = followRecords.map((f) => ({
      _id: f._id,
      follower: userMap[f.follower] || { username: f.follower },
      followee: f.followee,
      status: f.status,
      createdAt: f.createdAt,
    }));

    res.status(200).json({ message: "Followers fetched successfully", followers });
  } catch (error) {
    console.error("GetFollowers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFollowingController(req, res) {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const followRecords = await FollowModel.find({
      follower: user.username,
      status: "accepted",
    });

    // followee is a username string — manually look up user docs
    const userMap = await buildUserMap(followRecords.map((f) => f.followee));

    const following = followRecords.map((f) => ({
      _id: f._id,
      follower: f.follower,
      followee: userMap[f.followee] || { username: f.followee },
      status: f.status,
      createdAt: f.createdAt,
    }));

    res.status(200).json({ message: "Following fetched successfully", following });
  } catch (error) {
    console.error("GetFollowing error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  followUserController,
  UnfollowUserController,
  updateProfileController,
  getFollowRequestsController,
  acceptFollowRequestController,
  rejectFollowRequestController,
  getFollowersController,
  getFollowingController,
};