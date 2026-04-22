const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

async function createPostController(req, res) {
    try {
        console.log(req.body)
        console.log(req.file)

        const file = await imagekit.files.upload({
            file: req.file.buffer.toString("base64"),
            fileName: Date.now() + ".jpg"
        })

        res.send({
            message: "Upload success",
            url: file.url
        })

    } catch (err) {
        console.log(err)
        res.status(500).send("Error")
    }
}

module.exports = { createPostController }