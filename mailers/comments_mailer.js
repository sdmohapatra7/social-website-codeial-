const { info } = require('sass');
const nodemailer = require('../config/nodemailer');

//this is another way to exporting method
exports.newComment = (comment)=>{
    // console.log('Inside newComment mailer',comment);
    let htmlString = nodemailer.randerTemplate({comment:comment},'/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from:'sdmohapatra7@gmail.com',
        to:comment.user.email,
        subject:'new comment published!',
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error In sanding email',err);
            return;
        }
        console.log('Message Is sent',info);
        return;
    })
}
