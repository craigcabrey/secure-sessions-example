var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.db.each('SELECT user from users', function(err, row) {
    console.log(row);
  });
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  req.db.get("select * from users where user='" + req.body.user + "'", function(err, row) {
      if (err || !row) {
        res.send('invalid username and/or password');
      } else {
        if (req.body.password === row.password) {
          req.db.run("insert into sessions (id, user_id) values('" + 
            req.cookies.id + "', '" + row.id + "')");
          res.redirect('/');
        } else {
          res.send('invalid username and/or password');
        }
      }
  });
});

router.get('/logout', function(req, res, next) {
  req.db.run("delete from sessions where id='" + req.cookies.id + "'");
  res.clearCookie('id');
  res.redirect('/');
});

module.exports = router;
