var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('client-sessions');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport  = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
//var mongoSessionURL = "mongodb://localhost:27017/sessions";
var mongoSessionURL = "mongodb://root:root@ds035796.mlab.com:35796/test1";
var mongoStore = require("connect-mongo")(session);


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); 

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  //cookieName: 'session',
  secret: 'secret',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: false,
  saveUninitialized: false,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));

app.use(passport.initialize());
app.use(passport.session());



app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
          root = namespace.shift(),
          formParam = root;
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }

      return {
        param: formParam,
        msg: msg,
        value: value
      };

    }
}));

//connect flash
app.use(flash());

//global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
