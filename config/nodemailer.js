const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail,com',
    port:587,
    secure:false,
    auth:{
        user:'mohapatrashaktidhar@gmail.com',
        pass:'kzpnkgblenkcgthv'
    }
});

let randerTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailer',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('Error In Rander In template',err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;

}

module.exports = {
    transporter : transporter,
    randerTemplate:randerTemplate
}