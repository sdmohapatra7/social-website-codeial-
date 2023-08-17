const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require('../models/like');
const commentMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../worker/comment_email_worker');


module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            // commentMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('Error In createing A queue',err);
                    return;
                }
                console.log(job.id);
            });
            if (req.xhr) {
                // Similar for comments to fetch the user's id!
                
                return res.status(200).json
                    ({
                        data:
                        {
                            comment: comment
                        },
                        message: "Comment created"
                    });
            }
            req.flash('success', 'Comment Posted')
            return res.redirect("/");
        }
    } catch (err) {
        // console.log("Error", err);
        // return;
        req.flash('error', err);
        return res.redirect("/");
    }
};

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;
            comment.remove();
            //deleting from post Schema
            let post = await Post.findByIdAndUpdate(postId, {
                $pull: { comments: req.params.id },
            });
            //delete likes as well as comments
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }
            req.flash('success', 'Comments Deleted');
            return res.redirect("back");
        } else {
            req.flash('error', 'Yoy Cannot delete this Comment');
            return res.redirect("back");
        }
    } catch (err) {
        // console.log("Error", err);
        // return;
        req.flash('error', err);
        return res.redirect("back");
    }
};
