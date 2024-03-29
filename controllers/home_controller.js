
const Post = require('../models/post')
const User = require('../models/user')
// module.exports.action = function(req,res){};
module.exports.home = async function (req, res) {
    //return res.end('<h1>Express Is Up for Codial!</h1>');
    //print the cookies which is added in the browser
    // console.log(req.cookies);
    //if i want to change the cookies  value then
    // res.cookie('user_id',200);

    // Post.find({} , function(err,post){
    //     return res.render('home',{
    //         title : "Codeial | Home",
    //         post : post
    //     });
    // });

    //populate the user of each post
    /*Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate :{
            path:'user'
        }
    })
    .exec(function(err,post){
        User.find({},function(err,users){
            return res.render('home',{
                title : "Codeial | Home",
                post : post,
                all_users : users
            });
        });
        
    });*/
    try {
        let post = await Post.find({})
        //to sorted order our post
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
            .populate({
            path: 'comments',
            populate:{
                path: 'likes'
            }
        })
        .populate('likes')
        .exec();
        let users = await User.find({});
        return res.render('home', {
            title: "Codeial | Home",
            post: post,
            all_users: users
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }


}