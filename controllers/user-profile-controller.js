const User = require("../models/user-model");
const destructureUser = require("../Util/destructureUser");
const { getUserFromToken, createTokenForUser } = require("../services/auth-service");
const fs = require('fs');
const path = require('path');
const logger = require('winston');


function handleShowProfilePage(req, res){
    try {
        const user = destructureUser(req.user);
        return res.render('profile', { user });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load profile.' });
    }
};

async function handleUpdateProfile(req,res) {
    try {
        const { fullName } = req.body;
        let profileImageUrl = req.file?.filename?`/images/${req.file.filename}`:null;
        if (!profileImageUrl) {
            profileImageUrl = req.user.profileImageUrl;
        }
        const _id = req.user._id;

        const oldDoc= await User.findOneAndUpdate(
            { _id },
            { profileImageUrl, fullName },
            { new: false }  
        );
        const oldImageUrl = req.file?.filename?oldDoc.profileImageUrl:null;
        if(oldImageUrl && oldImageUrl!=='/images/defaultProfile.png'){
            removeOldProfileImage(oldImageUrl);
        }

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
};


function removeOldProfileImage(oldPath){
    const filePath = path.join(__dirname, '../public'+oldPath);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('Error deleting file:', err);
            //logger.error('Error deleting the file:', err)
        } else {
           
            //logger.info('Error deleting the file:', err)
        }
    });
}

module.exports = {
    handleShowProfilePage,
    handleUpdateProfile,
};
