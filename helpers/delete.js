/* Module to facilitate the recursive deletion of data. */
'use strict';

// Responses
var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
// Models
var Trip = require('../models/trip.js');
var Photo = require('../models/photo.js');
var Place = require('../models/place.js');
// Helpers
var imageurls = require('../helpers/image-urls.js');
// Dependencies
var fs = require('fs');
var aws = require('../config/aws.js');
// async module allows multiple async calls to be made in parallel, and action to
// be made when all of them have resolved. See: https://github.com/caolan/async#parallel
var _async = require('async');

// Async delete a list of photos from filesystem and the database
function deletePhotos(photos, resolve, reject) {
  var calls = [];
  photos.forEach(function(_photo) {
    calls.push(function(callback) {
      Photo.findById(_photo._id, function(err, photo) {
        // Delete from S3
        var params = {
          Bucket: aws.s3bucket,
          Key: photo.key
        };
        aws.s3.deleteObject(params, function(aws_err) {
          if(aws_err) {
            callback(aws_err);
            console.log("Error uploading data: ", err);
          } else {
            // Successfully deleted from S3
            console.log("Successfully deleted data from myBucket/myKey");
            photo.remove(function(m_err) {
              if(m_err) {
                callback(m_err);
                console.error("Unable to delete photo from database.");
              } else {
                console.log("Successfully deleted photo from database");
                callback(null);
              }
            });
          }
        });
      });
    });
  });
  _async.parallel(calls, function(err, results) {
    if(err) {
      reject();
    } else {
      resolve();
    }
  });
}

module.exports = {
  // Delete a list of photos from the database and filesystem.
  // Items in array 'photos' should match the database representation, (in
  // particular, the filename attribute should not be the client's url version).
  photos: function(res, photos) {
    // delete photos (fs + db reference)
    var deletePhotosPromise = new Promise(function(resolve, reject) {
      deletePhotos(photos, resolve, reject);
    });
    deletePhotosPromise.then(function() {
      return success.OK(res);
    }, function() {
      return error.InternalServerError(res, "Unable to delete photos");
    });
  },
  // Deletes a place and its associated photos
  place: function(res, place_id) {
    // Delete place from db
    Photo.find({place_id: place_id}, function(err, photos) {
      if(err) {
        return error.InternalServerError(res);
      } else {
        // delete photos for that place (fs + db reference)..
        var deletePhotosPromise = new Promise(function(resolve, reject) {
          deletePhotos(photos, resolve, reject);
        });
        deletePhotosPromise.then(function() {
          //...and the place itself.
          Place.find({_id: place_id}).remove(function(err) {
            if(err) {
              console.error("Unable to delete place from database.");
              return error.InternalServerError(res, "Unable to delete place from database");
            } else {
              return success.OK(res);
            }
          });
        }, function() {
          return error.InternalServerError(res, "Unable to delete photos from place");
        });
      }
    });
  },
  // Delete a trip, all associated places and all associated photos
  trip : function(res, trip_id) {
    // Find all the places in this trip
    Place.find({trip_id: trip_id}, function(err, places) {
      if(err) {
        return error.InternalServerError(res);
      } else {

        var calls = [];
        places.forEach(function(_place) {
          calls.push(function(callback) {
            // Delete all photos from each place
            Photo.find({place_id: _place._id}, function(err, photos) {
              if(err) {
                console.error("Unable to find photos. Error: " + err);
                callback(err);
              } else {
                // Delete photos for this place, from db + fs
                var deletePhotosPromise = new Promise(function(resolve, reject) {
                  deletePhotos(photos, resolve, reject);
                });
                deletePhotosPromise.then(function() {
                  // Delete the place itself
                  Place.find({_id: _place._id}).remove(function(err) {
                    if(err) {
                      console.error("Unable to delete place. Error: " + err);
                      callback(err);
                    } else {
                      // Successfully deleted this place and photos from db + S3!
                      callback(null);
                    }
                  });
                }, function() {
                  console.error("Unable to delete photos");
                  callback(true);
                });
              }
            });
          });
        });

        _async.parallel(calls, function(err, results) {
          if(err) {
            return error.InternalServerError(res, "Unable to delete trip");
          } else {
            // Delete the trip itself
            Trip.find({_id: trip_id}).remove(function(err) {
              if(err) {
                console.error("Unable to delete trip.");
                return error.InternalServerError(res, "Unable to delete trip");
              } else {
                return success.OK(res);
              }
            });
          }
        });
      }
    });
  }
}
