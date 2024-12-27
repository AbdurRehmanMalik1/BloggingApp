const express = require("express");
const commentRouter= require('./comment-router');
const {  
    handleShowBlog,
    handleShowAllBlogs,
    handleShowEditBlog,
    handleShowMyBlogs
} = require('../controllers/blog-controller');
const {restrictTo} = require('../middleware/auth-middleware');
const router= express.Router();

router.use(commentRouter);

router.get('/my',restrictTo(['USER','ADMIN']), handleShowMyBlogs);
router.get('/my/:id',restrictTo(['USER','ADMIN']), handleShowEditBlog);

router.get('/:id', handleShowBlog);

router.get('/', handleShowAllBlogs);

module.exports = router;