const express = require("express");
const {restrictTo} = require('../middleware/auth-middleware');
const destructureUser = require("../Util/destructureUser");
const {handleAddComment} = require('../controllers/comment-controller')
const router= express.Router();


router.post('/comment/:id' ,restrictTo(['ADMIN','USER']) ,handleAddComment);



module.exports = router;