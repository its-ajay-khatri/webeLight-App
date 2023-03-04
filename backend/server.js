const app = require("./app")
const dotenv = require("dotenv")
const cloudinary = require('cloudinary');
const connectDatabase = require("./database/database")

//Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting the server Down due to Uncaught Acception");

    process.exit(1)

})

//Config
dotenv.config({path:"backend/config/config.env"})

//Connect DB
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`Listening @ ${port}`);
})

//console.log(youtube)
//unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting the server Down due to Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1)
    });
});