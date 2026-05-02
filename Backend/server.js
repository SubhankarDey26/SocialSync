require("dotenv").config()
const app=require("./src/app")
const connectToDB=require("./src/config/Db")

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDB()
        app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
    } catch (error) {
        console.error("Failed to connect to DB:", error)
        process.exit(1)
    }
}

startServer()