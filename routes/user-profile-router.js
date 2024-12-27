const express = require("express");
const upload = require('../middleware/multer-middleware');
const { handleShowProfilePage,handleUpdateProfile}=require('../controllers/user-profile-controller');
const router = express.Router();

router.get('/', handleShowProfilePage);

router.put('/', upload.single('profileImage'), handleUpdateProfile);


module.exports = router;
