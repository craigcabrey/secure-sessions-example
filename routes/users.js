var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  if (req.body.user === 'bob') {
    res.send('yay');
  } else {
    req.db.get("select * from users where user='" + req.body.user + "'", function(err, row) {
        if (err || !row) {
          res.send('invalid username and/or password');
        } else {
          if (req.body.password === row.password) {
            req.db.run("insert into sessions (id, user_id) values('" + 
              req.session.id + "', '" + row.id + "')");
            res.redirect('/');
          } else {
            res.send('invalid username and/or password');
          }
        }
    });
  }
});

router.get('/logout', function(req, res, next) {
  req.db.run("delete from sessions where id='" + req.session.id + "'");
  req.session.destroy();
  res.send('logged out');
});

module.exports = router;
