const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const port = 2000;
const cors = require('cors');

//require express layouts
const expressLayouts = require('express-ejs-layouts');
//require mongoose 
const db = require('./config/mongoose');
//use for session cookies
const session = require('express-session');
const passport = require('passport');
const passportlocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const { default: mongoose } = require('mongoose');
const { create } = require('connect-mongo');

const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const chatServer = require('http').createServer(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(1000);
console.log('chat server is listening on port 1000');
app.use(cors());
//use middlewair
app.use(express.urlencoded());
//use cookieParser
app.use(cookieParser());
//use ststic file
app.use(express.static('./assets'));
//make the uploads path avalable to the browser
app.use('/uploads',express.static(__dirname +'/uploads'));
//use these layouts
app.use(expressLayouts);
//extract style and script from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookies in the db

app.use(session({
    name:'codeial',
    //Todo change the secret before depolyment in production mode
    secret:'Putrandomthistime',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
            mongooseConnection: db ,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//we set the flash after session cookies bcz it uses session cookies
app.use(flash());
app.use(customMware.setFlash);
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