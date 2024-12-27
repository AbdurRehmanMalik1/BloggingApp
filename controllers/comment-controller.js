const {destructureUser} = require("../Util/destructureUser");
const Comment = require("../models/comment-model");

async function handleAddComment(req,res){
    const blogId = req.params?.id;
    const user = req.user;

    if(!blogId) return res.status(400).json({error:'Sent Invalid Blog Id'});
    
    const {content } = req.body;

    if(!content ) return res.status(400).json({error:'Comment cannot be empty'});
    try{
        await Comment.create({blog:blogId,content,author:user._id});

        return res.redirect(`/blog/${blogId}`);
    } catch(error){
        return res.status(500).json({error:"Unknown Error occured"});
    }
}

module.exports = {
    handleAddComment,
}