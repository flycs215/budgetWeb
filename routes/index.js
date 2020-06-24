var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express', data: 'Saewon' });
// });

/* GET test page */
router.get('/controller', function(req, res, next) {
  res.render('/controller');
});

/* GET test page */
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express', data: 'Saewon' });
});

// GET home page.
router.get('/', function(req, res) {
  res.redirect('/api');
});

module.exports = router;
