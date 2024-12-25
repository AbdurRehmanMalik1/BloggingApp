const express = require("express");
const Blog = require("../models/blog-model");
const User = require("../models/user-model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {restrictTo} = require('../middleware/auth-middleware');
const destructureUser = require("../Util/destructureUser");
const router= express.Router();

router.get('/my',restrictTo(['USER','ADMIN']), async (req, res) => {
    const user = destructureUser(req.user);
    console.log(user);
    const blogs = await Blog.find({author:req.user._id});
    return res.render('myBlog', { user , blogs});
});
router.get('/my/:id',restrictTo(['USER','ADMIN']), async(req,res)=>{
    const blogId = req.params?.id;
    const blog = await Blog.findById(blogId);
    if(!blogId) return res.status(403).json({error:'Blog does not exist'});
    const user = destructureUser(req.user);
    const responseBody = {
        user,
        blog: {
            blog:blog._id,
            title:blog.title,
            content : blog.content,
            author: user.fullName,
            headerImageURL: blog.headerImageURL,
        }
    };
    console.log(responseBody);
    return res.render('blogDetail' , responseBody);
});

router.get('/:id', async (req, res) => {
    const blogId = req.params?.id;
    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(403).json({ error: 'Blog does not exist' });

    const author = await User.findById(blog.author._id);

    const user = destructureUser(req.user);
    console.log(user);
    const responseBody = {
        blog: {
            blog: blog._id,
            title: blog.title,
            content: blog.content,
            author: author.fullName,
            headerImageURL: blog.headerImageURL,
        },
    };

    console.log({user,blog:responseBody.blog});
    return res.render('blogDetail', {user,blog:responseBody.blog});
});

router.get('/', async (req, res) => {
    const user = destructureUser(req.user);
    const blogs = await Blog.find({});
    return res.render('blog', { user , blogs});
});


module.exports = router;