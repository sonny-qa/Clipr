module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  

  jshint: {
    options: {
      reporter: require('jshint-stylish')
    },
    build: ['Gruntfile.js']
  }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['jshint']);
};