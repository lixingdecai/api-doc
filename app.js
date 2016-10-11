const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const redis = require('connect-redis')(session);
const routes = require('./routes');
const config = require('./config');
const ejs = require('ejs');
require('./config/mongoose');
const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/template'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(compression());
app.use(express.static(path.join(__dirname, 'public/')));
app.use('/img', express.static('img'));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  store: new redis(config.redis),
  saveUninitialized: true
}));

routes.init(app);

app.use((req, res, next) => {
  var user;
  // console.log(req.session.user);
  // console.log(req.cookies.user);
  // if (!req.session.user && req.cookies.user) {
  //   user = JSON.parse(req.cookies.user);
  //   req.session.user = user;
  //   res.locals.user = req.session.user;
  // }
  next();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // });
    next();
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') !== 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // res.render('error', {
    //   message: err.message,
    //   error: {}
    // });
    next();
  });
}

module.exports = app;
