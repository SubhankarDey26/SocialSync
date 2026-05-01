const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const LikeModel=require("../models/Like.model")
const { post } = require("../routes/post.routes")
const FollowModel = require("../models/follow.model");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


// async function createPostController(req, res) {
   

//     const file = await imagekit.files.upload({
//         file: await toFile(Buffer.from(req.file.buffer), 'file'),
//         fileName: "Test",
//         folder: "cohort-2-insta-clone-posts"
//     })

//     const post = await postModel.create({
//         caption: req.body.caption,
//         imgUrl: file.url,
//         user: req.user.id
//     })

//     res.status(201).json({
//         message: "Post created successfully.",
//         post
//     })
// }

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

    const userId =req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200)
        .json({
            message: "Posts fetched successfully.",
            posts
        })

}

async function getPostDetails(req,res){


    const userId=req.user.id
    const postId=req.params.postId

    const post=await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message:"post not Found"
        })
    }

    const isValidUser=post.user.toString()===userId
    if(!isValidUser){
        return res.status(403).json({
            message:"Forbidden Content"
        })
    }

    return res.status(200).json({
        message:"Post Fetched Sucessfully",
        post
    })
}

async function LikePostController(req,res){
    try {
        const username=req.user.username
        const postId=req.params.postId

        const post =await postModel.findById(postId)

        if(!post){
            return res.status(404).json({
                message:"Post not Found"
            })
        }

        const existingLike = await LikeModel.findOne({
            post: postId,
            user: username
        });

        if (existingLike) {
            // Unlike
            await LikeModel.deleteOne({ _id: existingLike._id });
            res.status(200).json({
                message: "Post unliked successfully"
            });
        } else {
            // Like
            await LikeModel.create({
                post: postId,
                user: username
            });
            res.status(200).json({
                message: "Post liked successfully"
            });
        }
    } catch (error) {
        console.error("Error in LikePostController:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


// async function getFeedController(req, res) {
//     const user = req.user;

//     // Get list of users that the current user is following (accepted follows)
//     const following = await FollowModel.find({
//         follower: user.username,
//         status: 'accepted'
//     }).select('followee');

//     const followingUsernames = following.map(f => f.followee);
//     // Include user's own posts
//     followingUsernames.push(user.username);

//     const posts = await Promise.all(
//         (await postModel.find({
//             'user.username': { $in: followingUsernames }
//         }).populate("user", "-password").lean())
//         .map(async (post) => {
//             const isLiked = await LikeModel.findOne({
//                 user: user.username,
//                 post: post._id.toString()
//             });

//             const likeCount = await LikeModel.countDocuments({ post: post._id.toString() });

//             post.isLiked = Boolean(isLiked);
//             post.likeCount = likeCount;
//             return post;
//         })
//     );

//     res.status(200).json({
//         message: "Posts Fetched Successfully",
//         posts
//     });
// }


async function getFeedController(req, res) {
    const user = req.user;

    // Step 1: Get following usernames
    const following = await FollowModel.find({
        follower: user.username,
        status: "accepted"
    }).select("followee");

    let followingUsernames = following.map(f => f.followee);

    // include self
    followingUsernames.push(user.username);

    // Step 2: Convert usernames → userIds
    const users = await UserModel.find({
        username: { $in: followingUsernames }
    }).select("_id");

    const userIds = users.map(u => u._id);

    // Step 3: Fetch posts
    const posts = await Promise.all(
        (await postModel.find({
            user: { $in: userIds }
        }).populate("user", "-password").lean())
        .map(async (post) => {
            const isLiked = await LikeModel.findOne({
                user: user.username,
                post: post._id.toString()
            });

            const likeCount = await LikeModel.countDocuments({
                post: post._id.toString()
            });

            post.isLiked = Boolean(isLiked);
            post.likeCount = likeCount;
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