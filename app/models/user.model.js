var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: {type:String, unique:true, trim:true, required:true},
    firstname: {type:String, trim:true, required:true},
    lastname: {type:String, trim:true, required:true},
    email: {type:String, index:true, trim:true, required:true, 
            match:/.+\@.+\.+/},
    password: {type:String, trim:true, required:true,
            validate:[function(password){
             return password && password.length >=6;
            },'Password must be at least 6 Characters'
        ]},
    salt: String,
    provider: {
        type: String,
        required: 'Provider is required'
    },
    ProviderId: String,
    ProviderData: {},
    created:{type:Date, default:Date.now}
});
UserSchema.pre('save', function(next){
    if(this.password){
        this.salt = new Buffer.from(crypto.randomBytes(16).toString('base64'),'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
})

UserSchema.methods.hashPassword = function(password){
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

UserSchema.methods.authenticate = function(password){
    return this.password === this.hashPassword(password);
};
mongoose.model('User', UserSchema);
