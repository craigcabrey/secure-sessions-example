var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var role = 'guest';
  if (req.user) {
    role = req.user.role;
  }
  req.db.all('SELECT * from tasks', function(err, rows) {
    if (err) {
      res.send('oops, something went wrong');
    } else {
      res.render('tasks', {tasks: rows, role: role});
    }
  });
});

router.post('/', function(req, res, next) {
  if (req.user.role !== 'editor') {
    res.send('you\'re not allowed to do that');
  } else {
    req.db.run("insert into tasks (body) values('" + req.body.body + "')");
    res.redirect('/tasks');
  }
});

module.exports = router;
