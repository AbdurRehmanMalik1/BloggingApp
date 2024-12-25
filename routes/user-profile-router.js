const express = require("express");
const User = require("../models/user-model");
const { restrictTo } = require('../middleware/auth-middleware');
const destructureUser = require("../Util/destructureUser");
const { getUserFromToken, createTokenForUser } = require("../services/auth-service");

const router = express.Router();

router.get('/', restrictTo(['ADMIN', 'USER']), (req, res) => {
    try {
        const user = destructureUser(req.user);
        return res.render('profile', { user });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load profile.' });
    }
});

router.put('/', restrictTo(['ADMIN', 'USER']), async (req, res) => {
    try {
        const { profileImageUrl, fullName } = req.body;
        const _id = req.user._id;

        await User.updateOne({ _id }, { profileImageUrl, fullName });

        const cookieToken = req.cookies?.token;
        if (!cookieToken) {
            return res.status(401).json({ error: 'Authentication token missing.' });
        }

        const user = getUserFromToken(cookieToken);
        user.fullName = fullName;
        user.profileImageUrl = profileImageUrl;

        const newToken = createTokenForUser(user);
        res.clearCookie('token');
        res.cookie('token', newToken);
        
        return res.redirect('/');
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Failed to update profile.' });
    }
});

module.exports = router;
