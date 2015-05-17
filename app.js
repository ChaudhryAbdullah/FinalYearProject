var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var multer = require('multer');
var q = require("q");

//var logout = require('./routes/logout');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var fbAuth = require('./routes/facebookauth');
var addTrip = require('./routes/authenticated/addTrip');
var addEvent = require('./routes/authenticated/addEvent');
var index = require('./routes/authenticated/index');
var image = require('./routes/authenticated/image');

var app = express();
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'abdullah!@#$1234',
  saveUninitialized: true, // (default: true)
  resave: true, // (default: true)
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 5 /*5 days*/}}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth/facebook', fbAuth);

app.use(multer({ inMemory:true}));

app.all("*", function (req, res, next) {

  if (req.isAuthenticated()
    || req.originalUrl === "/"
    || req.originalUrl === "/login"
    || req.originalUrl === "/auth/facebook"
    || req.originalUrl === "/signup") {
    console.log("REQUEST IS AUTHENTICATED = " + req.originalUrl);
    return next();
  }
  else {
    console.log("REQUEST not autehnticated = " + req.originalUrl);
    res.sendfile("./views/login.html");
  }
});

app.use('/login', login);
app.use('/logout',logout);
app.use('/signup', signup);
app.use('/addTrip', addTrip);
app.use('/addEvent', addEvent);
app.use('/photo', image);
app.use('/', index);


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
