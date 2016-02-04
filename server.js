'use strict';

// REQUIRE MODULES
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

// CONFIGURE MODULES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CONNECT TO DATABASE
mongoose.connect('mongodb://localhost/webtechdb');

// SET NODE ENVIRONMENT
var env = (process.env.NODE_ENV || "development");
// SET PORT NUMBER
var port = process.env.PORT || 8080;

// REGISTER WEBSITE ROUTING, PREFIXED WITH "/"
// serve the website from the public folder on the default route
app.use('/', express.static('public'));

// REGISTER REST API ROUTING, PREFIXED WITH "/API"
var apiRouter = require('./api-routes.js')(app);
app.use('/api', apiRouter);

// ERROR HANDLERS
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/*
// development error handler; print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
// production error handler; no stacktrace
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });
}
*/

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
