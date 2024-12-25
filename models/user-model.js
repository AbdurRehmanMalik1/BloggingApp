const mongoose = require("mongoose");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email : {
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        required:true,
        default:"USER"
    },
    profileImageUrl: {
        type:String,
        required:false,
        default: "/images/defaultProfile.png"
    }
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = crypto.randomBytes(16).toString('hex');

        const hashedPassword = crypto
            .createHash('sha256')
            .update(this.password + salt) 
            .digest('hex');
        this.password = hashedPassword;
        this.salt = salt;
    }
    next();
});
userSchema.methods.verifyUser = function (password) {
    const hashedPassword = crypto
        .createHash('sha256')
        .update(password + this.salt)  
        .digest('hex');

    return this.password === hashedPassword;  
};
userSchema.pre('save', function(next) {

    if (!this.profileImageUrl) {
        console.log('defaulting img');
        this.profileImageUrl = '/images/defaultProfile.png';
    }
    next(); // Proceed with the save operation
});
userSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (!update.profileImageUrl) {
        console.log('defaulting img');
        update.profileImageUrl = '/images/defaultProfile.png';
    }else{
        
    }
    next(); 
});

userSchema.pre('updateOne', function(next) {
    const update = this.getUpdate();
    if (!update.profileImageUrl) {
        console.log('defaulting img');
        update.profileImageUrl = '/images/defaultProfile.png'; 
    }
    next();
});

const User = mongoose.model("user",userSchema);

module.exports = User;