const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index = async function(req,res){
    let posts = await Post.find({})
        //to sorted order our post
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });
    return res.json(200, {
        message:"list of post",
        posts: posts
    });
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        //.id means converting the id into strings
        if (post.user == req.user.id) {
            post.remove();
            await Comment.deleteMany({ post: req.params.id });

            return res.json(200,{
                message:"post associated comments deleted successfully"
            });
        } else {
            return res.json(401,{
                message:"You cann't delete this post"
            })
        }
    } catch (err) {
        return res.json(500,{
            message:"intenal server error"
        });
    }

}