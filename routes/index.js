var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'SWEN-755', user: req.user, id: req.session.id
  });
});

module.exports = router;
