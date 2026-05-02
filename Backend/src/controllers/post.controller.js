const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const LikeModel = require("../models/Like.model")
const UserModel = require("../models/user.model")
const FollowModel = require("../models/follow.model");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts"
    });

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    });

    res.status(201).json({
        message: "Post created successfully.",
        post
    });
}

async function getPostController(req, res) {
    const userId = req.user.id

    const posts = await postModel.find({ user: userId })

    res.status(200).json({
        message: "Posts fetched successfully.",
        posts
    })
}

async function getPostDetails(req, res) {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if (!post) {
        return res.status(404).json({ message: "post not Found" })
    }

    const isValidUser = post.user.toString() === userId
    if (!isValidUser) {
        return res.status(403).json({ message: "Forbidden Content" })
    }

    return res.status(200).json({ message: "Post Fetched Sucessfully", post })
}

async function LikePostController(req, res) {
    try {
        // ✅ Use req.user.id (ObjectId string from JWT) — always reliable
        const userId = req.user.id
        const postId = req.params.postId

        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not Found" })
        }

        // ✅ Query by both post AND user ObjectId — no more false "already liked" matches
        const existingLike = await LikeModel.findOne({
            post: postId,
            user: userId
        });

        if (existingLike) {
            // Unlike
            await LikeModel.deleteOne({ _id: existingLike._id });
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            // Like
            await LikeModel.create({
                post: postId,
                user: userId
            });
            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.error("Error in LikePostController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getFeedController(req, res) {
    const user = req.user;

    const following = await FollowModel.find({
        follower: user.username,
        status: "accepted"
    }).select("followee");

    let followingUsernames = following.map(f => f.followee);
    followingUsernames.push(user.username);

    const users = await UserModel.find({
        username: { $in: followingUsernames }
    }).select("_id");

    const userIds = users.map(u => u._id);

    // If the user follows nobody yet, show ALL posts (discovery mode)
    const query = userIds.length <= 1
        ? {}
        : { user: { $in: userIds } };

    const rawPosts = await postModel
        .find(query)
        .populate("user", "-password")
        .lean();

    const posts = await Promise.all(
        rawPosts.map(async (post) => {
            // ✅ Use user.id (ObjectId) for all like queries — consistent with LikePostController
            const isLiked = await LikeModel.findOne({
                user: user.id,
                post: post._id
            });

            const likeCount = await LikeModel.countDocuments({
                post: post._id
            });

            const isFollowing = await FollowModel.findOne({
                follower: user.username,
                followee: post.user?.username,
                status: "accepted"
            });

            post.isLiked = Boolean(isLiked);
            post.likeCount = likeCount;
            post.isOwnPost = post.user?.username === user.username;
            post.isFollowing = Boolean(isFollowing);
            return post;
        })
    );

    res.status(200).json({
        message: "Feed fetched successfully",
        posts
    });
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetails,
    LikePostController,
    getFeedController
}