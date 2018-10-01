var sass = require('node-sass-middleware');
var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var cookieSession = require('cookie-session');
var Session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var config = require('./config');
module.exports=function(){
    var app = express();
        app.use(cookieSession({
            name: 'Session',
            keys:['secret_key1','secret_key2']
        }));
        app.use(Session({
            secret: config.sessionSecret,
            resave : false,
            saveUninitialized: true
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
        app.use(validator());
    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    }else{
        app.use(compression());
    }

        app.set('views','./app/views');
        app.set('view engine','pug');
 
        app.use(sass({
            src:'./sass',
            dest:'./public/css',
            outputStyle:'compressed',
            prefix:'/css',
            //debug: true
        }))
        app.use(express.static('./public'));
    require('../app/routes/index.routes')(app);
    require('../app/routes/user.routes')(app);
    return app;
}
