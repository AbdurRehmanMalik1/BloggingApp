const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    content:{
        type: String,
        required:true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    headerImageURL:{
        type:String,
        default:"images/defaultBlogImage.png",
    },
    createdAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function(next) {
    if (!this.headerImageURL) {
        this.headerImageURL = "images/defaultBlogImage.png";
    }
    next();
});

const Blog = mongoose.model('blog', blogSchema);


module.exports = Blog;
