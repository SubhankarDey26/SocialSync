const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")
const authRouter=require("./routes/auth.routes")
const postRouter=require("../src/routes/post.routes")
const userRouter=require("../src/routes/user.routes")

const app=express()
app.use(express.json())
app.use(cookieParser())
// app.use(cors({
//     credentials:true,
//     origin:"http://localhost:5173"
// }))



app.use(cors({
    origin: true,
    credentials: true
}));


// app.use(express.static("./public"))




const path = require("path");

// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// React fallback (for routes like /login, /profile)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});







app.use("/api/auth",authRouter)
app.use("/api/posts",postRouter)
app.use("/api/users",userRouter)


app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports=app