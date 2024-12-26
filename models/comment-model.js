const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type:Date,
    }
});

commentSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    next();
});

const Comment = mongoose.model("comment",commentSchema);

module.exports = Comment;