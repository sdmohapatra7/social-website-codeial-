const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        //to check it is a xmal HTTP Request
        if (req.xhr) {
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it! (To display the user's name with the post added dynamically)
            // post = await Post.populate('user', 'name').execPopulate();
            return res.status(200).json({
                data: {
                    post: post,
                },
                message: "post created !"
            });
        }

        req.flash('success', 'Post Published')
        return res.redirect('back');
    } catch (err) {
        // console.log('Error', err);
        req.flash('error', err);
        // return;
        return res.redirect('back');
    }

}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        //.id means converting the id into strings
        if (post.user == req.user.id) {
            await Like.deleteMany({likeable: post._id, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            await post.deleteOne();
            await Comment.deleteMany({post:req.params.id});

            //to check it is a xmal HTTP Request
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                    },
                    message: "post deleted   !"
                });
            }

            req.flash('success', 'Post and Associated Comments Deleted');
            return res.redirect('back');
        } else {
            req.flash('error', 'Yoy Cannot delete this post');
            return res.redirect('back');
        }
    } catch (err) {
        // console.log('Error', err);
        req.flash('error', err);
        // return;
        return res.redirect('back');
    }

}