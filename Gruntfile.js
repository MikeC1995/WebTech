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
          "apps/public/assets/styles/css/app.css": "apps/public/assets/styles/less/app.less",
          "apps/login/assets/styles/css/app.css": "apps/login/assets/styles/less/app.less"
        }
      }
    },
    // FILE WATCHING
    watch: {
      styles: {
        files: ['apps/public/assets/styles/less/**/*.less', 'apps/login/assets/styles/less/**/*.less'], // which files to watch
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
