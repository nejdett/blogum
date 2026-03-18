const mongoose = require("mongoose")
const {Schema} = mongoose

const postSchema = new Schema({
    image: {
    type: String,
    default: null
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: [String],
        default: "Genel"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)

module.exports = Post
