const JWT = require("jsonwebtoken");
const secret = "bloggingApp93@3123><P";

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

    return JWT.sign(payload,secret,options);
}

function getUserFromToken(token){
    try {
        return JWT.verify(token, secret);
    } catch (error) {
        console.log(error);
        throw new Error("Invalid or expired token");
    }
}


module.exports = {
    createTokenForUser,
    getUserFromToken,
}