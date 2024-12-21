const express = require("express");
const User = require("../models/user-model");

const router = express.Router();



router.get('/login', (req, res) => {
    return res.render('login');
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.render('login', { error: "Invalid User" });
    }
    
    const isValid = user.verifyUser(password);
    
    if (!isValid) {
        console.log(`Is valid : ${isValid}`);
        return res.render('login', { error: "Invalid Password" });
    }
    return res.render('home', {fullName: user.fullName});
});


router.get('/signup', (req, res) => {
    return res.render('signup');
});
router.post('/signup', async (req, res) => {
    const { email, password,fullName } = req.body;
    console.log(`Email: ${email},Fulle Name: ${fullName} ,Password: ${password}`)
    const validationError = checkSignUpFields(email, fullName, password);
    if (validationError) {
        console.log(`Error had occured: ${validationError}`);
        return res.render("signup", { error: validationError });
    }

    try {
        const user = await User.create({ email, password, fullName });

        if (!user) {
            return res.render('signup', { error: "Failed To Signup" });
        }
        console.log("Created User");
        return res.render('home', { fullName });
    } catch (error) {
        console.log(`Error had occured: ${error}`);
        return res.render('signup', { error: "An error occurred, please try again." });
    }
});

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


module.exports = router;
