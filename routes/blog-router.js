const express = require("express");
const Blog = require("../models/blog-model");


const router = express.Router();



router.get('/add' , (req,res)=>{
    return res.render('addBlog' ,{fullName: req.user.fullName});
});


module.exports = router;