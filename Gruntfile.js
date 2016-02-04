'use strict';

module.exports = function(grunt) {
  // Just in time Grunt plugin loading
  require('jit-grunt')(grunt);

  grunt.initConfig({
    // LESS CSS
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2,
          strictMath: true,
          strictUnits: true
        },
        files: {
          "public/assets/styles/css/app.css": "public/assets/styles/less/app.less" // destination file and source file
        }
      }
    },
    // FILE WATCHING
    watch: {
      styles: {
        files: ['public/assets/styles/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    },
    // LIVE RELOAD SERVER
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    // WATCH FILES FOR COMPILATION + RUN NODEMON CONCURRENTLY
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    }

  });

  grunt.registerTask('default', ['less', 'concurrent']);
};
