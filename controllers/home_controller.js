// module.exports.action = function(req,res){};
module.exports.home = function(req,res){
    //return res.end('<h1>Express Is Up for Codial!</h1>');
    return res.render('home',{
        title : "Codeial Home"
    });
}