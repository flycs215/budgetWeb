var User = require('../models/usermodule.js');
var bodyParser = require('body-parser');
var async = require('async');

exports.getData = function (req, res, next) {

    // var list_user, list_user2;

    async.parallel({
        list_user: function (callback) {
            User.find()
                .exec(callback)
        },

        list_user2: function (callback) {
            User.find()
                .exec(callback)
        },

    }, function (err, results) {
        res.render('index', { title: 'Budget list', user_List: results.list_user, user_List2: results.list_user2 });
    }

    )
    /* 
     async.parallel({

       list_user: function(callback){
           User.find()
           .exec(callback)
       },
       list_user2: function(callback){
           User.find()
           .exec(callback)
       }
   }, function(err, results){
       if (err) { return next(err); }

       res.render('index', { title: 'Budget list', user_List: results.list_User, user_List2: results.list_User2} );
   }
   );
    
    */


    // User.find()
    //     .exec(function (err, data) {
    //         list_user = data;
    //         User.find()
    //         .exec(function (err, data) {
    //             list_user2 = data;
    //             res.render('index', { title: 'Budget list', user_List: list_user, user_List2: list_user2});
    //         });
    //     });


    // var list_user2= function(res){
    //     User.find()
    //     .exec(res)
    // };





    /* 되는것
    User.find()
    .exec(function (err, list_User) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { title: 'Budget list', user_List: list_User} );
    })
    
    */


    /* 
   
  
  
   
   
   */



    /* 되는것
   
    */

    /* 
    var month_Data =function(){
        var now, month, months, year, thisMonth;
        now = new Date();
        //var christmas = new Date(2020, 12, 25);
        month = now.getMonth();
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        year = now.getFullYear();
        return months[month];
    }
     */




    /* 
     month_Data: function(){
            var now, month, months, year, thisMonth;
            now = new Date();
            //var christmas = new Date(2020, 12, 25);
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            return thisMonth = months[month];
        },
    
    */


    /* 
            this_Month: function() {
            
        },
        
        */

};

exports.saveData = [
    (req, res, next) => {


        console.log('creatUser_Post is working!');

        var type, description, value;
        type = req.body.add_type;
        description = req.body.add_description;
        value = req.body.add_value;
        console.log(type, description, value);

        var allItems = function (type, description, value) {
            this.type = type;
            this.description = description;
            this.value = value;

        };
        console.log('allItem: ', allItems);



        // var data = [];
        // data.push(allItems);
        // console.log(data);

        var user = new User(
            {

                type: req.body.add_type,
                description: req.body.add_description,
                value: req.body.add_value
            }
        );

        user.save(function (err) {
            if (err) { return next(err); }
            // Genre saved. Redirect to genre detail page.
            res.redirect(user.url);
        });

        // res.render('result_page', { title: 'Express', id: id, age: age, method: "post" });
        // Create new ID
        // if (data.allItems[type].length > 0){
        // ID = data.allItems[type][data.allItems[type].length -1].id + 1;

        // }else{
        // ID = 0;
        // }
        // var 

        // addItem(type,description,value);
        // console.log(data, Expense());
        /* 
        var Expense = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };

        Expense.prototype.calcPercentage = function(totalIncome){
            
            if (totalIncome > 0){
                this.percentage = Math.round((this.value / totalIncome)*100);
            }else{
                this.percentage = -1;
            }
        };

        Expense.prototype.getPercentage = function(){
            return this.percentage;
        };

        var Income = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        };
        var calculateTotal = function(type){
            var sum = 0;
            data.allItems[type].forEach(function(cur){
                sum += cur.value;
            });
            data.totals[type] = sum;
        }

        var data = {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0 
            },
            budget: 0,
            percentage: -1
        };

        var addItem = function(type, des, val){
            var newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;

            }else{
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else{
                newItem = new Income(ID,des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);
            return newItem;

        };
        
        */





    }
];


/*
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

*/




/*
  var displayMonth = function(){
    var now, month, months, year;

    now = new Date();
    //var christmas = new Date(2020, 12, 25);
    month = now.getMonth();
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    year = now.getFullYear();
    return months[month];
  }
  res.render('index', { title: 'Express', data: displayMonth() });
});

*/
