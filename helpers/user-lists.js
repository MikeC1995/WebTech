/* Module to get . */
'use strict';

var User = require('../models/user.js');
var https = require('https');
var _async = require('async');

module.exports = {
  // A list of publicly visible users
  whitelist: whitelist,
  // A list of the user's friends
  friendlist: friendlist,
  // Concatenation of whitelist and friend list
  allowedList: allowedList
};


function whitelist() {
  return new Promise(function(resolve, reject) {
    User.find({ public: true }, function(err, users) {
      if(err) return reject();
      resolve(users);
    });
  });
}

function friendlist(user) {
  return new Promise(function(resolve, reject) {
    new Promise(function(resolve, reject) {
      // Get the ids of the user's fb friends using the Graph API
      var req = https.request({
        host: 'graph.facebook.com',
        port: 443,
        path: '/v2.6/' + user.facebookID + '/friends?access_token=' + user.accessToken,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }, function(res) {
        var output = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });
        res.on('end', function() {
          var obj = JSON.parse(output);
          (function(statusCode, object) {
            if(!object.data) {
              return reject();
            }
            var fbIds = [];
            for(var i = 0; i < object.data.length; i++) {
              fbIds.push(object.data[i].id);
            }
            resolve(fbIds);
          })(res.statusCode, obj);
        });
      });
      req.on('error', function(err) {
        reject();
      });
      req.end();
    }).then(function(fbIds) {
      // Get fb friends of the users by their facebook ids
      User.find({
        'facebookID': { $in: fbIds }
      }, function(err, friends) {
        if(err) reject();
        resolve(friends);
      });
    });
  });
}

// Concatenation of whitelist and friend list
function allowedList(user) {
  return new Promise(function(resolve, reject) {
    whitelist().then(function(publicUsers) {
      friendlist(user).then(function(friends) {
        var users = publicUsers.concat(friends);
        resolve(users);
      }, reject);
    }, reject);
  });
}
