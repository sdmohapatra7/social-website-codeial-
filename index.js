const express = require('express');
const app = express();
const port = 2000;

//use express routers
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        // console.log('Error: ',err);
        //another way to print error in backtiks using interpolation with in backtiks then doler then curly brackets...
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server Is Running On port : ${port}`);
});