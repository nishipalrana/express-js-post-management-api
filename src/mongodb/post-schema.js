const mongoose = require('mongoose');

// Define the Post schema for MongoDB
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    keywords: {
        type: [String]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

// Define the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = { Post };