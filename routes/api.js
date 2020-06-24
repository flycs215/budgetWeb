var express = require('express');
var router = express.Router();
var async = require('async');
var itemData = require('../models/itemData.js');


// router.get('/', function(req, res) {
//   // res.redirect('/control');
//   res.render('index', { title: 'Budget list'});
// });

router.post('/delete', function (req, res, next) {
  console.log(req.body.id);
  // delete data from database here
  itemData.findByIdAndRemove(req.body.id, function deleteId(err) {
    if (err) { return next(err); }

    // res.sendStatus(500);
    // Success - go to Control page
    res.json({ result: 'OK' });
    // res.redirect('/control')
  })

});


// // GET home page.
router.get('/', function (req, res, next) {
  async.parallel({
    list_user: function (callback) {
      itemData.find()
        .exec(callback)
    },

    list_user2: function (callback) {
      itemData.find()
        .exec(callback)
    },

  }, function (err, results) {

    res.render('index', { title: 'Budget list', user_List: results.list_user, user_List2: results.list_user2 });
  }

  )


});


router.post('/add', function (req, res, next) {
  console.log(req.body);
  console.log('hello')


  var newData = new itemData(
    {

      type: req.body.add_type,
      description: req.body.add_description,
      value: req.body.add_value
    }
  );

  newData.save(function (err, product) {
    if (err) { return next(err); }
    // Genre saved. Redirect to genre detail page.
    res.json(product);
  });


});



module.exports = router;
