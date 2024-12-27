const express = require("express");
const upload = require('../middleware/multer-middleware')
const {  handleShowAddBlogPage,handleCreateBlog,} = require('../controllers/add-blog-controller');

const router = express.Router();

router.get('/', handleShowAddBlogPage);

router.post('/create', upload.single('headerImage'), handleCreateBlog);

module.exports = router;
