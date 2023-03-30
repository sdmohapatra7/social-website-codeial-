const express = require('express');
const app = express();
const port = 2000;
//use express layouts
const expressLayouts = require('express-ejs-layouts');
//use ststic file
app.use(express.static('./assets'));
app.use(expressLayouts);
//extract style and script from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
//use express routers
app.use('/',require('./routes'));
//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        // console.log('Error: ',err);
        //another way to print error in backtiks using interpolation with in backtiks then doler then curly brackets...
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server Is Running On port : ${port}`);
});