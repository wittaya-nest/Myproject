process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport(); //don't work
app.listen('3000');
module.exports.app;
console.log("Server Running Http:localhost:3000");