const mongoose = require('mongoose');

const SauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: {
        type: Number,
        min: 1,
        max: 10
    },
    likes: Number,
    dislikes: Number,
    userLiked: [String],
    userDisliked: [String]
});

module.exports = mongoose.model('sauce', SauceSchema);