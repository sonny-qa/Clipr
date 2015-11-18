// Gruntfile.js
module.exports = function(grunt) {

  // tells how much time each task takes
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt)({
    pluginsRoot: 'node_modules'
  });

  // Load Plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project Configuration

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Runs JS Hint on JavaScript files
    jshint: {
      options: {
        force: true,
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      src: [
        'app/*/*.js',
        '!app/bower_components/**/*.js',
        'server/**/*.js',
        'server/config/*.js',
        'chrome_ext/**/*.js'
      ]
    },

    // Lints CSS files
    csslint: {
      options: {
        force: true
      },
      src: [
        'app/styles/*.css'
      ]
    },

    // Lints HTML files - Work-in-Progress
    // htmlangular: {
    //   default_options: {
    //     options: {
    //       angular: true,
    //       customtags: ['custom-tag', 'custom-*'],
    //       customattrs: ['fixed-div-label', 'custom-*'],
    //       wrapping: {
    //         'tr': '<table>{0}</table>'
    //       }
    //     },
    //     files: {
    //       src: 'app/**/*.html'
    //     }
    //   }
    // },
    
    // Concatenates JS Files
    concat: {
      options: {
      //Defines string to put between each file
        separator: ';'
      },
      dist: {
       //files to concatenate
        src: [
        'app/**/*.js',
        '!app/bower_components/**/*.js',
        '!app/assets/**/*.js',
        '!app/dist/**/*.js'
        ],
       //the location of the resulting JS file
        dest: 'app/dist/js/app.concat.js'
      }
    },

    // Takes JS files and minifies them
    uglify: {
      options: {
        mangle: false,  // setting to false preserves var names
        preserveComments: false
      },
      build: {
        src: 'app/dist/js/app.concat.js',
        dest: 'app/dist/js/app.min.js'
      }
    },

    // Minify CSS
    cssmin: {
      css: {
        src: 'app/styles/stylesheet.css',
        dest: 'app/dist/css/stylesheet.min.css'
      }
    },

    // grunt uncss - Work-in-Progress

    // this task deletes ‘stuff’ - use with caution!
    clean: {
      all: [
        'app/dist/**/'
      ]
    },

    // Watches back-end files for changes, restarts the server
    express: {
      all: {
        options: {
          port: 3000,
          hostname: "0.0.0.0",
          // bases denotes where it will look for files
          // replace w/ dir you want files served from
          bases: ['app/'], 
          livereload: true
        }
      }
    },

    // grunt-open will open your browser at the projects URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:3000/#/clips'
      }
    },

    // Watches for front-end file changes and reruns tasks as needed
    // Just leave "grunt watch" running in background terminal
    watch: {
      options: {
        livereload: true
      },

      // When Gruntfile changes, we just want to lint it. When the Gruntfile changes, it will automatically reload!
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint'],
        options: {
          livereload: false
        }
      },

      // When our Javascript source file changes, want to lint them
      // and run unit tests
      jssrc: {
        files: [
          'app/*/*.js',
          '!app/bower_components/**/*.js',
          'server/**/*.js',
          'server/server.js',
          'chrome_ext/**/*.js'
        ],
        tasks: ['jshint', 'concat', 'uglify']
      },


      //when the CSS files change, we need to lint and minify
      css: {
        files: 'app/styles/*.css',
        tasks : ['csslint', 'cssmin']
      },

      //when the HTML files change, we need to compile it
      //TODO: define 'tasks'
      // html: {
      //   files: [
      //     'app/**/*.html',
      //     '!app/bower_components/',
      //     '!app/dist/'
      //   ],
      //   tasks: ['htmllint']
      // }

      //When JavaScript unit test file changes we only need to lint it
      //and run the unit test. No livereloading
      //TODO: defined
      // jsunit: {
      //   files: ['test/spec/**/*.js'],
      //   tasks: ['jshint:test', 'karma:unit:run'],
      //   options: {
      //     livereload: false
      //   }
      // }

    }
  });

  // Default Tasks
  grunt.registerTask('default', ['build']);
  grunt.registerTask('dev', ['build']);
  grunt.registerTask('server', ['express', 'open', 'watch']);
  grunt.registerTask('build', ['clean', 'jshint', 'csslint', 'concat', 'uglify', 'cssmin']);
};