const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        email: user.email,
        role : user.role,
        profileImageUrl: user.profileImageUrl
    }
    const options = {
        expiresIn: "1h", // Token will expire in 1 hour
    };

    return JWT.sign(payload,JWT_SECRET,options);
}

function getUserFromToken(token){
    try {
        return JWT.verify(token, JWT_SECRET);
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = {
    createTokenForUser,
    getUserFromToken,
}