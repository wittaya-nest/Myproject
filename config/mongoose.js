var config = require('./config');
var mongoose = require('mongoose')
module.exports = function () {
    mongoose.set('debug', config.debug);
    var db = mongoose.connect(config.mongoUri,{useCreateIndex: true,useNewUrlParser: true});//config=envfile,mongoUri=mongodb://localhost/myproject
    require('../app/models/user.model');
    return db;
}
