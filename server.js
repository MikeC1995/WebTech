'use strict';

// REQUIRE MODULES
var express    = require('express');          // call express
var app        = express();                   // define our app using express
var bodyParser = require('body-parser');      // reading request bodies
var cookieParser = require('cookie-parser');  // reading cookies
var session = require('express-session');     // session storage
var mongoose   = require('mongoose');         // mongodb interface
var passport = require('passport');           // authentication
var auth = require('./config/auth');          // auth configuration

// CONNECT TO DATABASE
var mongo_uri = process.env.MONGOLAB_URI;
mongoose.connect(mongo_uri);

// SET ENVIRONMENT AND PORT
var env = (process.env.NODE_ENV || "development");
var port = process.env.PORT || 8081;

// MIDDLEWARE
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
auth(passport);


// STATICALLY SERVE DEPENDENCIES FOR USE BY CLIENT
app.use('/npm_scripts', express.static('node_modules'));
app.use('/bower_scripts', express.static('bower_components'));

// MIDDLEWARE TO BE USED WHEN ENSURING USER IS LOGGED IN
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// LOGIN PAGE
app.use('/login', express.static(__dirname + '/apps/login'));
// URL TO LOG IN WITH FACEBOOK
app.get('/auth/facebook', passport.authenticate('facebook'));
// URL REACHED AFTER LOGIN ATTEMPT
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', failureRedirect: '/login' }
));

// API ROUTES
var apiRouter = require('./api-routes.js')(app);
app.use('/api', apiRouter);

// SERVE THE ANGULAR APP IF AUTHENTICATED
app.use('/', ensureAuthenticated, express.static(__dirname + '/apps/public'));

// 404 ERROR HANDLER
// This is the last piece of middleware to be wired up.
// If no routes matched, return a 404.
app.use(function(req, res, next) {
  return require('./responses/errors.js').NotFound(res);
});

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
