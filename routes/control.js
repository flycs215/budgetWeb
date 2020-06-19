var express = require('express');
var router = express.Router();

// Require controller modules.
var content_controller = require('../controller/contentController');
var bodyParser = require('body-parser');

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/', content_controller.getData);

// POST request for creating Book.
router.post('/', content_controller.saveData);

/* 
router.post('/', function(req, res, next){
  // req.body object has your form values
  console.log('hi');
  var type = req.body.add_type;
  var description = req.body.add_description;
  var value = req.body.add_value;
  console.log(type); 
  // res.render('result_page', { title: 'Express', id: id, age: age, method: "post" });
});

*/

module.exports = router;