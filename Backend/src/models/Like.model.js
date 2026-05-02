const mongoose = require("mongoose")

const LikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "post id is required for creating a like"]
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User id is required for creating a like"]
    }
  },
  {
    timestamps: true   
  }
)

LikeSchema.index({ post: 1, user: 1 }, { unique: true })

const LikeModel = mongoose.model("likes", LikeSchema)

module.exports = LikeModel