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
var mongo_uri = process.env.MONGOLAB_URI || 'mongodb://localhost/webtechdb';
mongoose.connect(mongo_uri);

// SET NODE ENVIRONMENT
var env = (process.env.NODE_ENV || "development");
// SET PORT NUMBER
var port = process.env.PORT || 8080;

// REGISTER WEBSITE ROUTING, PREFIXED WITH "/"
// serve the website from the public folder on the default route
app.use('/', express.static('public'));

// TEMPORARY FOLDER FOR SERVING USER IMAGES, EMULATING AWS S3 INSTANCE
// TODO: Migrate to AWS S3
app.use('/uploads', express.static('uploads'));

// REGISTER REST API ROUTING, PREFIXED WITH "/API"
var apiRouter = require('./api-routes.js')(app);
app.use('/api', apiRouter);

// 404 ERROR HANDLER
// This is the last piece of middleware to be wired up.
// If no routes matched, return a 404.
var err = require('./responses/errors.js');
app.use(function(req, res, next) {
    return err.NotFound(res);
});

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
