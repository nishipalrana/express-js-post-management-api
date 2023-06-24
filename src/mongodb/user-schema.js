const mongoose = require('mongoose');
// Define the User schema for MongoDB

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilePicture: {
        type: Buffer,
        required: true
    }
});

// Define the User model
const User = mongoose.model('User', userSchema);

module.exports = { User };