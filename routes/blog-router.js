const express = require("express");
const Blog = require("../models/blog-model");
const User = require("../models/user-model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {restrictTo} = require('../middleware/auth-middleware');
const router= express.Router();

router.get('/my',restrictTo(['USER','ADMIN']), async (req, res) => {
    const fullName = req.user?.fullName;
    const blogs = await Blog.find({author:req.user._id});
    return res.render('myBlog', { fullName , blogs});
});
router.get('/my/:id' , async(req,res)=>{
    const fullName = req.user?.fullName;
    const blogId = req.params?.id;
    const blog = await Blog.findById(blogId);
    if(!blogId) return res.status(403).json({error:'Blog does not exist'});
    const author = await User.findById(blog.author._id);
    const responseBody = {
        fullName,
        blog: {
            blog:blog._id,
            title:blog.title,
            content : blog.content,
            author: author.fullName,
            headerImageURL: blog.headerImageURL,
        }
    };
    console.log(responseBody);
    //console.log(blogId);
    return res.render('blogDetail' , responseBody);
});

router.get('/:id' , async(req,res)=>{
    const fullName = req.user?.fullName;
    const blogId = req.params?.id;
    const blog = await Blog.findById(blogId);
    if(!blogId) return res.status(403).json({error:'Blog does not exist'});
    const author = await User.findById(blog.author._id);
    const responseBody = {
        fullName,
        blog: {
            blog:blog._id,
            title:blog.title,
            content : blog.content,
            author: author.fullName,
            headerImageURL: blog.headerImageURL,
        }
    };
    console.log(responseBody);
    //console.log(blogId);
    return res.render('blogDetail' , responseBody);
});
router.get('/', async (req, res) => {
    const fullName = req.user?.fullName || 'Guest'; 
    const blogs = await Blog.find({});
    return res.render('blog', { fullName , blogs});
});


module.exports = router;