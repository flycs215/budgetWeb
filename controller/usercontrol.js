
var User = require('../models/usermodule.js');


exports.creatUser_get = function(req, res, next) {
    res.render('user_creat', { title: 'Create User' });
  };

exports.creatUser_post = [
    (req, res, next) => {

        
        var user = new User({
            name: req.body.name
        });

        user.save(function (err) {
            if (err) { return next(err); }
            // Genre saved. Redirect to genre detail page.
            res.redirect(user.url);
        });
    }
    
];  

exports.userList = function(req, res, next) {
    User.find()
    
    .sort([['name', 'ascending']])
    .exec(function(err, list_users){
        if(err){
            return next(err);
        }
        res.render('user_list', {title: 'User list', userList: list_users});
        console.log(list_users);
    });
    
};