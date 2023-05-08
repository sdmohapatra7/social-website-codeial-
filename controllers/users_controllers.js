const User = require('../models/user')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../worker/comment_email_worker');
const userResetWorker = require('../worker/user_email_worker');
// const resetPasswordMiller = require('../mailers/reset_password_mailer');

module.exports.profile = function (req, res) {
    // return res.end('<h1>Users Profile!</h1>');
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: "Codeial Profile",
            profile_user: user
        });
    });

}

module.exports.update = async function (req, res) {
    /*if (req.user.id == req.params.id) {
        //req.body eqals with {name:req.body.name,email:req.body.email}
        User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            req.flash('success','Updated!');
            return res.redirect('back');
        });
    } else {
        req.flash('error','Unauthorized');
        return res.status(401).sand('Unauthorized');
    }*/
    if (req.user.id == req.params.id) {
        try {
            //find the user
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('***multer error', err);
                }
                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {

                    if (user.avatar) {
                        //delete the privious and update with new avatar
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                    }
                    //this is the saving the path of uploaded file inton the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect("back");
            });
        } catch (error) {
            req.flash('error', err);
            return res.redirect("back");
        }
    } else {
        req.flash('error', 'Unauthorized');
        return res.status(401).sand('Unauthorized');
    }
}

//render the sign up page
module.exports.signUp = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up', {
        title: "Codeial | sign up"
    })
}
//render the sign in page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in', {
        title: "Codeial | sign in"
    })
}

//get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log("error in finding user in signing up");
            return;
        }
        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) {
                    console.log("error in createing user while signing up");
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        } else {
            return res.redirect('back');
        }
    });
}

//sign in and create a session for user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');
}

//sign out
module.exports.destroySession = function (req, res) {
    return req.logout(function (err) {
        if (err) {
            // console.log(err);
            // return next(err); 
            return;
        }
        req.flash('success', 'You Have Logged Out!');
        return res.redirect('/');
    });

}

module.exports.resetPassword = function (req, res) {
    return res.render('reset_password',
        {
            title: 'Codeial | Reset Password',
            access: false
        });
}

module.exports.resetPassMail = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log('Error in finding user', err);
            return;
        }
        if (user) {
            if (user.isTokenValid == false) {
                user.accessToken = crypto.randomBytes(30).toString('hex');
                user.isTokenValid = true;
                user.save();
            }

            let job = queue.create('user-emails', user).save(function (err) {
                if (err) {
                    console.log('Error in sending to the queue', err);
                    return;
                }
                console.log('Job enqueued', job.id);
            });
            // resetPasswordMiller.resetPassword(user);


            req.flash('success', 'Password reset link sent. Please check your mail');
            return res.redirect('/');
        }
        else {
            req.flash('error', 'User not found. Try again!');
            return res.redirect('back');
        }
    });
}

module.exports.setPassword = function (req, res) {
    User.findOne({ accessToken: req.params.accessToken }, function (err, user) {
        if (err) {
            console.log('Error in finding user', err);
            return;
        }
        if (user.isTokenValid) {
            return res.render('reset_password',
                {
                    title: 'Codeial | Reset Password',
                    access: true,
                    accessToken: req.params.accessToken
                });
        }
        else {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
}

module.exports.updatePassword = function (req, res) {
    User.findOne({ accessToken: req.params.accessToken }, function (err, user) {
        if (err) {
            console.log('Error in finding user', err);
            return;
        }
        if (user.isTokenValid) {
            if (req.body.newPass == req.body.confirmPass) {
                user.password = req.body.newPass;
                user.isTokenValid = false;
                user.save();
                req.flash('success', "Password updated. Login now!");
                return res.redirect('/users/sign-in')
            }
            else {
                req.flash('error', "Passwords don't match");
                return res.redirect('back');
            }
        }
        else {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    });
}