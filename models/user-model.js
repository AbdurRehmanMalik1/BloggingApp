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
        required:true,
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        required:true,
        default:"USER"
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

const user = mongoose.model("user",userSchema);




module.exports = user;