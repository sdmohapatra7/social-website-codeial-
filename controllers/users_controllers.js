const User = require('../models/user')

module.exports.profile = function(req,res){
    // return res.end('<h1>Users Profile!</h1>');
    return res.render('user_profile',{
        title : "Codeial Profile"
    });
}
//render the sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Codeial | sign up"
    })
}
//render the sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title:"Codeial | sign in"
    })
}

//get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log("error in finding user in signing up");
            return;
        }
        if(!user){
            User.create(req.body ,function(err,user){
                if(err){
                    console.log("error in createing user while signing up");
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }
    }); 
}

//sign in and create a session for user
module.exports.createSession = function(req,res){
    
}
