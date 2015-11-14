module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
        'app/**/*.js',
        '!app/bower_components/**/*js',
        '!app/assets/js/*js',
        '!app/dist/**/*js'
        ],
        dest: 'app/dist/js/app.concat.js'
      }
    },

    // css: {
    //   dist: {
    //     options: {
    //       sourceMap: true,
    //       outputStyle: 'compressed'
    //     },
    //     files: {
    //       'app/dist/css/app.css': 'app/assets/scss/app.scss'
    //     }
    //   }
    // },

    uglify: {
      options: {
        preserveComments: false
      },
      build: {
        src: 'app/dist/js/app.concat.js',
        dest: 'app/dist/js/app.min.js'
      }
    },

    jshint: {
      files: [
      'app/**/*.js',
      '!app/assets/js/*js',
      '!app/bower_components/**/*js',
      '!app/components/**/*js',
      '!app/dist/**/*js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
        'public/lib/**/*.js',
        'public/dist/**/*.js'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
        'app/**/*.js',
        '!app/assets/js/*js',
        '!app/bower_components/**/*js',
        '!app/components/**/*js',
        '!app/dist/**/*js'
        ],
        tasks: [
        'jshint',
        'concat',
        'uglify'
        ]
      }
      // css: {
      //   files: 'app/styles/*.css',
      //   tasks: ['css']
      // }
    },

    shell: {
      view: {
        command: 'open http://localhost:3000/',
        options: {
          execOptions: {
                maxBuffer: 500 * 1024 // or Infinity
              }
            }
          },
          server:{
            command: 'nodemon server/server.js'
          }
        }
      });

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-shell');
// grunt.loadNpmTasks('grunt-sass');


  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////


  grunt.registerTask('default', [
    'watch'
  ]);

  // Compile all sass files
  // grunt.registerTask('sass-compile', [
  //   'sass'
  // ]);

  // Create and check file
  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    // 'sass'
  ]);


  // Open the HTML app file
  grunt.registerTask('view', function () {
    grunt.task.run([ 'shell:view' ]);
  });

  // Start local server
  grunt.registerTask('server', function () {
    grunt.task.run(['build']);
    grunt.task.run([ 'shell:server' ]);
  });


};