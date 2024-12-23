const {createTokenForUser,getUserFromToken} = require('../services/auth-service');
const User = require('../models/user-model');


async function checkAuthentication(req, res, next) {
    const token = req.cookies?.token;
    if(!token) return next();
    const tokenUser = getUserFromToken(token);
    const returnedUser = await User.findOne({
        _id: tokenUser._id,
        email: tokenUser.email,
        role: tokenUser.role,
        profileImageUrl: tokenUser.profileImageUrl,
    });
    req.user = returnedUser;
    //console.log(req.user);
    if (req.originalUrl === '/') {
        return res.render('home', { fullName: returnedUser.fullName});
    }
    next();
}

function restrictTo(roles = []) {
    return (req, res, next) => {
        if (!req.user) return res.redirect('/user/login');
    
        if (roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).send('Forbidden');
    };
}

module.exports = {
    checkAuthentication,
    restrictTo,
}