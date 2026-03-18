require("dotenv").config()
const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
const options = {
    dbName: "User"
}


const connecttodb = () => {
    mongoose.connect(url, options)
    mongoose.connection.once("connected", () => [
        console.log("veritabanı bağlantısı başarılı")
    ])
}

module.exports = connecttodb