const User = require("../models/user-model");
const {createTokenForUser} = require("../services/auth-service");

function handleShowLoginPage(req, res) {
    return res.render('login');
};


async function handleLogin(req, res){
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.render('login', { error: "Invalid Email or Password" });
    }
    
    const isValid = user.verifyUser(password);
    
    if (!isValid) {
        return res.render('login', { error: "Invalid Email or Password" });
    }
    const token = createTokenForUser(user);
    res.cookie('token', token);
    return res.redirect('../');
};


function handleShowSignupPage(req, res) {
    return res.render('signup');
};


async function handleSignUp(req, res) {
    const { email, password,fullName } = req.body;
    const validationError = checkSignUpFields(email, fullName, password);
    if (validationError) {
        return res.render("signup", { error: validationError });
    }

    try {
        const user = await User.create({ email, password, fullName });

        if (!user) {
            return res.render('signup', { error: "Failed To Signup" });
        }
        const token = createTokenForUser(user);
        res.cookie('token', token);
        return res.redirect('../');
    } catch (error) {
        if (error.code === 11000) {
            return res.render('signup', { error: "Email already exists." });
        }
        return res.render('signup', { error: "An error occurred, please try again." });
    }
};

function handleLogout(req, res) {
    res.clearCookie('token');  
    return res.redirect('/'); 
};

function checkSignUpFields(email, fullName, password) {
    if (!email || email.trim() === "") {
        return "Email is required.";
    }
    if (!fullName || fullName.trim() === "") {
        return "Full Name is required.";
    }
    if (!password || password.trim() === "") {
        return "Password is required.";
    }
    return null;
}


module.exports = {
    handleLogin,
    handleLogout,
    handleShowLoginPage,
    handleShowSignupPage,
    handleSignUp,
};
