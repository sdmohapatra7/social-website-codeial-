
const Post = require('../models/post')
// module.exports.action = function(req,res){};
module.exports.home = function(req,res){
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
    Post.find({}).populate('user').exec(function(err,post){
        return res.render('home',{
            title : "Codeial | Home",
            post : post
        });
    });
    
}