/* Module to transform image filenames to their actual url path on the filesystem.
** This should eventually convert between db filenames and AWS S3 temporary urls */
"use strict";

module.exports = {
  // filename to url where the image is accessible
  nameToPath: function(name) {
    return "/uploads/" + name;
  },
  // url to filename, (removes '/uploads/' prefix)
  pathToName: function(path) {
    return path.slice(9);
  }
}
