const express = require("express");
const Blog = require("../models/blog-model");
const upload = require('../middleware/multer-middleware')
const fs = require("fs");
const path = require("path");
const destructureUser = require('../Util/destructureUser');
const logger = require('../logger');


//const upload = blogImageMulter;
const router = express.Router();



router.get('/', (req, res) => {
    const user = destructureUser(req?.user);
    return res.render('addBlog', { user });
});

router.post('/create', upload.single('headerImage'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const { _id: userId } = req.user;
        const headerImageURL = req.file?.filename?`/images/${req.file.filename}`:null;
        const blog = await Blog.create({
            title,
            content,
            headerImageURL,
            author: userId,
        });

        if (!blog) {
            throw new Error("Failed to create blog.");
        }
        return res.redirect('./');
    } catch (error) {
        console.error(error);
        if (req.file) {
            const filePath = path.join(__dirname, '../public/images', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('Error deleting the file:', err);
                    //logger.error('Error deleting the file:', err);
                } else {
                    //logger.info('File deleted successfully');
                }
            });
        }
        return res.render('addBlog', { 
            user: destructureUser(req.user), 
            error: error.message || "An unexpected error occurred." 
        });
    }
});

module.exports = router;
