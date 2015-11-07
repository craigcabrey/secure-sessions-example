var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cookies = require('./cookies');
var routes = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run(
    "create table if not exists users(id integer primary key autoincrement," +
    "user varchar, password varchar, role varchar)"
  );
  db.run(
    "create table if not exists sessions(id text, user_id int)"
  );
  db.run(
    "create table if not exists tasks(id integer primary key autoincrement," +
    "body text)"
  );

  db.run(
    "insert into users (user, password, role) values('bob', 'password', 'viewer')"
  );
  db.run(
    "insert into users (user, password, role) values('alice', 'password', 'editor')"
  );
  db.run("insert into tasks (body) values('do swen-755 assignment')");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use(cookies());
app.use('/', routes);
app.use('/users', users);
app.use('/tasks', tasks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
