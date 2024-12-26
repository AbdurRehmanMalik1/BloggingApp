const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type:Date,
    }
});

commentSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    next();
});
// userSchema.methods.verifyUser = function (password) {
//     const hashedPassword = crypto
//         .createHash('sha256')
//         .update(password + this.salt)  
//         .digest('hex');

//     return this.password === hashedPassword;  
// };
// userSchema.pre('save', function(next) {

//     if (!this.profileImageUrl) {
//         console.log('defaulting img');
//         this.profileImageUrl = '/images/defaultProfile.png';
//     }
//     next(); // Proceed with the save operation
// });
// userSchema.pre('findOneAndUpdate', function(next) {
//     const update = this.getUpdate();
//     if (!update.profileImageUrl) {
//         console.log('defaulting img');
//         update.profileImageUrl = '/images/defaultProfile.png';
//     }else{
        
//     }
//     next(); 
// });

// userSchema.pre('updateOne', function(next) {
//     const update = this.getUpdate();
//     if (!update.profileImageUrl) {
//         console.log('defaulting img');
//         update.profileImageUrl = '/images/defaultProfile.png'; 
//     }
//     next();
// });

const Comment = mongoose.model("comment",commentSchema);

module.exports = Comment;