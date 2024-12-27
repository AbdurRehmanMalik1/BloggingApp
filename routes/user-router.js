const express = require("express");
const profileRouter = require('./user-profile-router');
const { restrictTo } = require("../middleware/auth-middleware");
const { 
    handleLogin,
    handleLogout,
    handleShowLoginPage,
    handleShowSignupPage,
    handleSignUp
} = require('../controllers/user-controller');
const router = express.Router();

router.use('/profile',restrictTo(['USER', 'ADMIN']),profileRouter);

router.get('/login', handleShowLoginPage);

router.post('/login',handleLogin);

router.get('/signup' , handleShowSignupPage);

router.post('/signup',handleSignUp);

router.post('/logout', handleLogout);

module.exports = router;
