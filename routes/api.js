var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  // res.redirect('/control');
  res.json({result: 'OK'});
});

router.post('/delete', function(req, res) {
  console.log(req.body);
  // delete data from database here
  // res.sendStatus(500);
  res.json({result: 'OK'});
});


module.exports = router;
