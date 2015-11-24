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
        '!app/dist/',
        'server/**/*.js',
        'server/config/*.js',
        'Gruntfile.js',
        'chrome_ext/**/*.js',
        'test/**/*.js'
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


    // this task deletes ‘stuff’ - use with caution!
    clean: {
      release: [
        'app/dist/**/',
        'app/styles/stylesheet-cleaned.css'
      ]
    },

    // Copy files into the dist folder
    // copy: {
    //   dist: {
    //     cwd: 'app',
    //     expand: true,
    //     src: 
    //     dest:
    //   }
    // },

    // Remove css not being used
    uncss: {
      dist: {
        files: {
          'app/styles/stylesheet-cleaned.css': 
          [
            'app/index.html', 
            'app/Auth/*.html', 
            'app/Clips/*.html', 
            'app/clipSelect/*.html', 
            'app/Landing/*.html', 
            'app/Profile/*.html', 
            'app/Services/*.html', 
            'app/Suggestions/*.html'
          ]
        }
      }
    },

    // Concatenates JS Files
    concat: {
      options: {
      //Defines string to put between each file
        separator: ';'
      },
      js: {
       //files to concatenate
        src: [
        'app/bower_components/jquery/dist/jquery.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-animate/angular-animate.js',
        'app/bower_components/angular-cookies/angular-cookies.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'app/bower_components/angular-ui-router/release/angular-ui-router.js',
        'app/bower_components/angular-aside/dist/js/angular-aside.js',
        'app/bower_components/angular-sanitize/angular-sanitize.js',
        'app/bower_components/angular-touch/angular-touch.js',
        'app/app.js',
        'app/Services/services.js',
        'app/Auth/AuthController.js',
        'app/Clips/clippedController.js',
        'app/Clips/headerController.js',
        'app/Clips/sidebarController.js',
        'app/clipSelect/suggestedController.js'
        ],
       //the location of the resulting JS file
        dest: 'app/dist/js/app.concat.js'
      }
    },

    // processhtml: {
    //   dist: {
    //     files: {

    //     }
    //   }
    // },

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
      build: {
        files: {
          // target file : src files
          'app/dist/css/stylesheet.min.css': 
          [
            'app/styles/stylesheet-cleaned.css'
          ]
        }
      }
    },

    //Compress Images
    imagemin : {
      dynamic: {
        files : [{
          expand: true,
          cwd: 'app/assets/',
          src: 'images/*.{png,jpg,gif}',
          dest: 'app/dist/'
        }]
      }
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
  // TEST BUILD
  grunt.registerTask('default', ['build']);
  grunt.registerTask('dev', ['build']);
  grunt.registerTask('server', ['express', 'open', 'watch']);
  grunt.registerTask('build', ['clean', 'jshint', 'csslint', 'concat', 'uglify', 'imagemin']);
};