require("dotenv").config()
const app=require("./src/app")
const connectToDB=require("./src/config/Db")

async function startServer() {
    try {
        await connectToDB()
        app.listen(3000,()=>{
            console.log("Server is Running on the PORT 3000")
        })
    } catch (error) {
        console.error("Failed to connect to DB:", error)
        process.exit(1)
    }
}

startServer()