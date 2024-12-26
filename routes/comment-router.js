const express = require("express");
const Blog = require("../models/blog-model");
const User = require("../models/user-model");
const path = require("path");
const {restrictTo} = require('../middleware/auth-middleware');
const destructureUser = require("../Util/destructureUser");
const Comment = require("../models/comment-model");
const router= express.Router();


router.post('/comment/:id' ,restrictTo(['ADMIN','USER']) ,async (req,res,next)=>{
    const blogId = req.params?.id;
    const user = req.user;

    if(!blogId) return res.status(400).json({error:'Sent Invalid Blog Id'});
    
    const {content } = req.body;
    
    if(!content ) return res.statusCode(400).json({error:'Comment cannot be empty'});
    try{
        const comment = Comment.create({blog:blogId,content,author:user._id});

        const destructuredUser = destructureUser(user);
        return res.redirect(`/blog/${blogId}`);
    } catch(error){
        return res.json({error:"Unknown Error occured"});
    }
});






module.exports = router;