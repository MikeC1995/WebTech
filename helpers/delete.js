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

// Async delete a list of photos from filesystem and the database
// TODO: AWS S3
function deletePhotos(photos) {
  var i = photos.length - 1;
  if(i == undefined || i == -1) {
    // No photos - do nothing
    return;
  }

  while(i >= 0) {
    // Delete photo from filesystem
    fs.unlink('./uploads/' + photos[i].filename, function(err) {
      if(err) {
        // TODO: handle error?
        console.error("Unable to delete photo from filesystem. Error: " + err);
        return;
      }
    });
    // Delete photo from database
    Photo.find({_id: photos[i]._id}).remove(function(err) {
      if(err) {
        // TODO: handle error?
        console.error("Unable to delete photo from database.");
      }
    });
    i--;
  }
}

module.exports = {
  // Delete a list of photos from the database and filesystem.
  // Items in array 'photos' should match the database representation, (in
  // particular, the filename attribute should not be the client's url version).
  photos: function(res, photos) {
    // delete photos (fs + db reference)
    deletePhotos(photos);
    // This is async, and we return OK immediately (potentially lengthy operation)
    return success.OK(res);
  },
  // Deletes a place and its associated photos
  place: function(res, place_id) {
    // Delete place from db
    Photo.find({place_id: place_id}, function(err, photos) {
      if(err) {
        return error.InternalServerError(res);
      } else {
        // delete photos for that place (fs + db reference)..
        deletePhotos(photos);
        //...and the place itself.
        Place.find({_id: place_id}).remove(function(err) {
          if(err) {
            // TODO: handle error
            console.error("Unable to delete place from database.");
          }
        });

        // Methods above are async, and we return OK immediately
        // regardless of their success (potentially lengthy operations!)
        return success.OK(res);
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

        for(var i = 0; i < places.length; i++) {
          // Delete all photos from each place
          Photo.find({place_id: places[i]._id}, function(err, photos) {
            if(err) {
              console.error("Unable to find photos. Error: " + err);
            } else {
              // Delete photos for this place, from db + fs
              deletePhotos(photos);
            }
          });

          // Delete the place itself
          Place.find({_id: places[i]._id}).remove(function(err) {
            if(err) {
              console.error("Unable to delete place. Error: " + err);
            }
          });
        }

        // Delete the trip itself
        Trip.find({_id: trip_id}).remove(function(err) {
          if(err) {
            console.error("Unable to delete trip. Error: " + err);
          }
        });

        // Above is all async, so we return OK immediately (potentially lengthy operations)
        return success.OK(res);
      }
    });
  }
}
