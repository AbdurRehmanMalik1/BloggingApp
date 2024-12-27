const Blog = require("../models/blog-model");
const User = require("../models/user-model");
const mongoose = require("mongoose");

const destructureUser = require("../Util/destructureUser");


async function handleShowMyBlogs(req, res){
    const user = destructureUser(req.user);
    const blogs = await Blog.find({author:req.user._id});
    return res.render('myBlog', { user , blogs});
};
async function handleShowEditBlog(req, res){
    try {
        const blogId = req.params?.id;

        // Check if the blog exists and aggregate with comments and user details
        const blogWithDetails = await Blog.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(blogId) } // Match the blog ID
            },
            {
                $lookup: {
                    from: "comments",       // Join the `comments` collection
                    localField: "_id",      // Field in `Blog`
                    foreignField: "blog",   // Field in `Comments`
                    as: "comments"          // Output array
                }
            },
            {
                $unwind: {
                    path: "$comments",      // Flatten comments array for next lookup
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",          // Join the `users` collection
                    localField: "comments.author", // Field in `Comments`
                    foreignField: "_id",    // Field in `Users`
                    as: "comments.author"
                }
            },
            {
                $unwind: {
                    path: "$comments.author", // Flatten user details array
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {                  
                    _id: "$_id",                             // Grouping by blog ID (_id)
                    title: { $first: "$title" },             // Use the first value of `title` in the group
                    content: { $first: "$content" },         // Use the first value of `content`
                    author: { $first: "$author" },           // Use the first value of `author`
                    headerImageURL: { $first: "$headerImageURL" }, // First header image URL
                    comments: {                              // Accumulate comments into an array
                        $push: {
                            _id: "$comments._id",            // Comment ID
                            content: "$comments.content",    // Comment content
                            author: "$comments.author"       // Author details of the comment
                        }
                    }
                }
            }
        ]);
        if (!blogWithDetails.length) {
            return res.status(403).json({ error: 'Blog does not exist' });
        }

        const blog = blogWithDetails[0];

        // Fetch author details
        const author = await User.findById(blog.author);
        if (!author) return res.status(404).json({ error: 'Author not found' });

        const user = destructureUser(req.user);

        // Build response for rendering
        const responseBody = {
            _id: blog._id,
            title: blog.title,
            content: blog.content,
            author: author.fullName,
            headerImageURL: blog.headerImageURL,
            comment: blog.comments, // Includes comments with user details
        };
        if( JSON.stringify(responseBody.comment[0])=='{}') {
            responseBody.comment=[];
        }
        return res.render('blogDetail', { user, blog: responseBody });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleShowBlog(req, res) {
    try {
        const blogId = req.params?.id;

        // Check if the blog exists and aggregate with comments and user details
        const blogWithDetails = await Blog.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(blogId) } // Match the blog ID
            },
            {
                $lookup: {
                    from: "comments",       // Join the `comments` collection
                    localField: "_id",      // Field in `Blog`
                    foreignField: "blog",   // Field in `Comments`
                    as: "comments"          // Output array
                }
            },
            {
                $unwind: {
                    path: "$comments",      // Flatten comments array for next lookup
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",          // Join the `users` collection
                    localField: "comments.author", // Field in `Comments`
                    foreignField: "_id",    // Field in `Users`
                    as: "comments.author"
                }
            },
            {
                $unwind: {
                    path: "$comments.author", // Flatten user details array
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {                  
                    _id: "$_id",                             // Grouping by blog ID (_id)
                    title: { $first: "$title" },             // Use the first value of `title` in the group
                    content: { $first: "$content" },         // Use the first value of `content`
                    author: { $first: "$author" },           // Use the first value of `author`
                    headerImageURL: { $first: "$headerImageURL" }, // First header image URL
                    comments: {                              // Accumulate comments into an array
                        $push: {
                            _id: "$comments._id",            // Comment ID
                            content: "$comments.content",    // Comment content
                            author: "$comments.author"       // Author details of the comment
                        }
                    }
                }
            }
        ]);
        if (!blogWithDetails.length) {
            return res.status(403).json({ error: 'Blog does not exist' });
        }

        const blog = blogWithDetails[0];

        // Fetch author details
        const author = await User.findById(blog.author);
        if (!author) return res.status(404).json({ error: 'Author not found' });

        const user = destructureUser(req.user);

        // Build response for rendering
        const responseBody = {
            _id: blog._id,
            title: blog.title,
            content: blog.content,
            author: author.fullName,
            headerImageURL: blog.headerImageURL,
            comment: blog.comments, // Includes comments with user details
        };
        if( JSON.stringify(responseBody.comment[0])=='{}') {
            responseBody.comment=[];
        }
        return res.render('blogDetail', { user, blog: responseBody });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



async function handleShowAllBlogs(req, res){
    const user = destructureUser(req.user);
    const blogs = await Blog.find({});
    return res.render('blog', { user , blogs});
};


module.exports = {
    handleShowBlog,
    handleShowAllBlogs,
    handleShowEditBlog,
    handleShowMyBlogs,
};