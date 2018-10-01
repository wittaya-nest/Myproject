var User = require('mongoose').model('User');
var password = require('passport');

var getErrorMessage = function(err){
    var message = '';
    if(err.code){
        switch (err.code){
            case 11000:
            case 11001:
                message = "Username Already exists";
                break;
            default:
            message = "USometing went wrong";
        }
    }else {
        for (var errName in err.errors){
            if(err.errors[errName].message){
                message = err.errors[errName].message;
            }     
        }
    }
    return message;
};

exports.list = function(req,res,next){
    console.log("UserCheck: " + User);
    User.find({}, function(err, users){
        if (err){
            console.log("Error List");
            return next(err);
        }else{
            res.json(users);
            var data = (JSON.stringify(users));
            console.log("Success List");
        }
    });
};

exports.read = function(req,res){
    res.json(req.user);
};

exports.userByusername = function(req,res,next,username){
    User.findOne({
            username: username
        }, function(err,user){
        if (err){
            return next(err);
        }else{
            req.user = user;
            next();
        }
    });
};

exports.update = function(req,res){
    User.findOneAndUpdate({username:req.user.username}, req.body,
        function(err, user){
            if(err){
                return next(err);
            }else{
                res.json(user);
            }
        });
};

exports.delete = function(req,res,next){
    req.user.remove(function(err){
        if(err){
            return next(err);
        }else{
            res.json(req.user);
        }
    });
};

exports.renderLogin = function(req,res){
    if(!req.user){
        res.render('login',{
            messages: req.flash('error') || req.flash('info') 
        });
    }else{
        return res.redirect('/');
    }
};


exports.logout = function(req,res){
    req.logout();
    req.session = null;
    res.render('index',{
        isLoggedIn:false
    });
}

exports.renderSignup = function(req,res){
    res.render('signup',{
        title:'Sign Up',
        messages:req.flash('error')
    });
};

exports.Signup = function(req, res, next){
    if(!req.user) {
        var user = new User(req.body);
        user.provider = 'local';
        console.log('In Sign Up')
        user.save(function(err){
            if(err){
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            };
            req.login(user, function(err){
                if(err) return next(err);
                return res.redirect('/');
            });
        });
    }
};