const express = require("express");
const Blog = require("../models/blog-model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const destructureUser = require('../Util/destructureUser');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const imagesPath = path.join(__dirname, '../public/images'); // Path to 'public/images'
        return cb(null, imagesPath);
    },
    filename: function (req, file, cb) {
        console.log(file);
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E5);
        console.log(`File Original Name: ${file.originalname}`);
        return cb(null, uniquePrefix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
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
                    console.error('Error deleting the file:', err);
                } else {
                    console.log('File deleted successfully');
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
