const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const port = 2000;
//require express layouts
const expressLayouts = require('express-ejs-layouts');
//require mongoose 
const db = require('./config/mongoose');
//use middlewair
app.use(express.urlencoded());
//use cookieParser
app.use(cookieParser());
//use ststic file
app.use(express.static('./assets'));
//use these layouts
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