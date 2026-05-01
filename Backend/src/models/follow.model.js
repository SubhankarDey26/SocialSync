const mongoose = require("mongoose")

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
      required: true
    },
    followee: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)

followSchema.index({follower:1,followee:1},{unique:true})

const FollowModel = mongoose.model("follows", followSchema)

module.exports = FollowModel