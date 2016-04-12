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
          // destination file and source file
          "public/assets/styles/css/app.css": "public/assets/styles/less/app.less",
          "landing/assets/styles/css/app.css": "landing/assets/styles/less/app.less"
        }
      }
    },
    // FILE WATCHING
    watch: {
      styles: {
        files: ['public/assets/styles/less/**/*.less', 'landing/assets/styles/less/**/*.less'], // which files to watch
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
    // TESTING
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/api.js']
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

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['less', 'concurrent']);
};
