// Gruntfile.js

module.exports = function(grunt) {
  // tells how much time each task takes
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt)({
    pluginsRoot: 'node_modules'
  });

  // // Load Plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-html-angular-validate');


  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  
  // Runs JS Hint on JavaScript files
  jshint: {
    options: {
      jshintrc: true,
      reporter: require('jshint-stylish')
    },
    src: [
      'app/*/*.js',
      '!app/bower_components/**/*.js',
      // 'server/**/*.js',
      'chrome_ext/**/*.js'
    ]
  },

  // Lints CSS files
  csslint: {
    src: [
      'app/styles/*.css'
    ]
  },

  // Lints HTML files
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

  // grunt uncss

  // this task deletes ‘stuff’ - use with caution!
  clean: {
    all: [
      'app/dist/**/'
    ]
  },

  // Watches back-end files for changes, restarts the server
  // nodemon: {
  //   dev: {
  //     script: 'server/server.js',
  //     options: {
  //       env: {
  //         PORT: 3000
  //       },
  //       watch: ["server"],
  //       delay: 300,
  //       ext: 'js,ejs,html',
  //       callback: function(nodemon) {
  //         nodemon.on('log', function(event) {
  //           console.log(event.colour);
  //         });
  //         nodemon.on('config:update', function(event) {
  //           console.log('custom logging');
  //           console.log(event);
  //         });
  //         nodemon.on('restart', function() {
  //           setTimeout(function() {
  //             require('fs').writeFileSync('.rebooted', 'rebooted');
  //           }, 1000);
  //         });
  //       }
  //     }
  //   }
  // },

  // Watches front-end files for changes and reruns tasks as needed.
  // we have a watch set up that checks to see if
  // any of the files listed below change, and then to execute the listed 
  //tasks when they do. This just saves us from having to type "grunt" into
  //the command-line every time we want to see what we're working on; we can
  //instead just leave "grunt watch" running in a background terminal

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
        // 'server/**/*.js',
        'chrome_ext/**/*.js'
      ],
      tasks: ['jshint']
    },

    //when the CSS files change, we need to lint and minify
    css: {
      files: 'app/styles/*.css',
      tasks : ['newer:csslint', 'newer:cssmin']
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

  // Will emit a watch event when watched files are modified
  // grunt.event.on('watch', function(action, filename, target) {
  //   grunt.log.writeln(target + ': ' + filename + ' has ' + action);
  // });

  // Default Tasks
  grunt.registerTask('dev', ['build','watch']);
  // grunt.registerTask('jshint', ['jshint']);
  grunt.registerTask('default', ['build']);
  // grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['clean', 'jshint', 'csslint', 'concat', 'uglify', 'cssmin']);
};