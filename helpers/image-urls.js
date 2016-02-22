// Module to transform image filenames to their actual url path
"use strict";

module.exports = {
  nameToPath: function(name) {
    return "/uploads/" + name;
  },
  pathToName: function(path) {
    return path.slice(9);
  }
}
