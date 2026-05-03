const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const LikeModel = require("../models/Like.model");
const UserModel = require("../models/user.model");
const FollowModel = require("../models/follow.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const file = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: `post-${req.user.id}-${Date.now()}`,
      folder: "cohort-2-insta-clone-posts",
    });

    const post = await postModel.create({
      caption: req.body.caption || "",
      imgUrl: file.url,
      user: req.user.id,
    });

    res.status(201).json({ message: "Post created successfully.", post });
  } catch (error) {
    console.error("CreatePost error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getPostController(req, res) {
  try {
    const userId = req.user.id;
    const posts = await postModel.find({ user: userId });
    res.status(200).json({ message: "Posts fetched successfully.", posts });
  } catch (error) {
    console.error("GetPost error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getPostDetails(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isValidUser = post.user.toString() === userId;
    if (!isValidUser) return res.status(403).json({ message: "Forbidden" });

    res.status(200).json({ message: "Post fetched successfully", post });
  } catch (error) {
    console.error("GetPostDetails error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function LikePostController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingLike = await LikeModel.findOne({ post: postId, user: userId });

    if (existingLike) {
      await LikeModel.deleteOne({ _id: existingLike._id });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      await LikeModel.create({ post: postId, user: userId });
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("LikePost error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFeedController(req, res) {
  try {
    const user = req.user;

    const following = await FollowModel.find({
      follower: user.username,
      status: "accepted",
    }).select("followee");

    let followingUsernames = following.map((f) => f.followee);
    followingUsernames.push(user.username);

    const users = await UserModel.find({
      username: { $in: followingUsernames },
    }).select("_id");

    const userIds = users.map((u) => u._id);

    // If following nobody yet, show ALL posts (discovery mode)
    const query = userIds.length <= 1 ? {} : { user: { $in: userIds } };

    const rawPosts = await postModel
      .find(query)
      .sort({ _id: -1 }) // newest first
      .populate("user", "-password")
      .lean();

    const posts = await Promise.all(
      rawPosts.map(async (post) => {
        const isLiked = await LikeModel.findOne({
          user: user.id,
          post: post._id,
        });

        const likeCount = await LikeModel.countDocuments({ post: post._id });

        const isFollowing = await FollowModel.findOne({
          follower: user.username,
          followee: post.user?.username,
          status: "accepted",
        });

        return {
          ...post,
          isLiked: Boolean(isLiked),
          likeCount,
          isOwnPost: post.user?.username === user.username,
          isFollowing: Boolean(isFollowing),
        };
      })
    );

    res.status(200).json({ message: "Feed fetched successfully", posts });
  } catch (error) {
    console.error("GetFeed error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetails,
  LikePostController,
  getFeedController,
};