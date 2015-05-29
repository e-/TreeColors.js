'use strict';
module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      js: {
        src: ['TreeColors.js', 'demo/*.js']
      },
      test: {
        src: ['test/*.js']
      }
    },
    uglify: {
      options: {
        banner: '\/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> *\/\n'
      },
      build: {
        src: 'TreeColors.js',
        dest: 'TreeColors.min.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%= jshint.js.src %>',
        tasks: ['jshint:js']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test']
      }
    },
    nodeunit: {
      all: ['test/*.js']
    }
  });

  grunt.registerTask('default', ['jshint', 'nodeunit', 'uglify']);
};
