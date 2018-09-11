module.exports = function(grunt) {
    grunt.initConfig({
        browserSync: {
            files: {
                src: [
                    'index.html',
                    'desktop.html',
                    'dist/app.css',
                    'components/**/*.{js|html}'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: './',
                }
            },
        },
        concat: {
            scripts: {
                options: {
                    separator: ';',
                    banner: ";(function(window, undefined) {",
                    footer: "}(this));"

                },
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/angular-ui-router/angular-ui-router.min.js',
                    'bower_components/add-to-homescreen/src/addtohomescreen.min.js',
                    'dist/_templates.js',
                    'components/app.module.js',
                    'components/**/*.js'
                ],
                dest: 'dist/app.js'
            }
        },
        html2js: {
            options: {
                module: 'templates',
                base: './',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                src: ['components/**/*.tpl.html'],
                dest: 'dist/_templates.js'
            }
        },
        htmlmin: {
            dev: {
                files: {
                    'dist/index.html': 'index.html',
                    'dist/desktop.html': 'desktop.html',
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images/'
                }]
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    //  importing the other scss's in the 3pak.scss file
                    'dist/app.css': 'components/3pak.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['components/3pak.scss', 'components/**/*.scss'],
                tasks: ['sass']
            },
            js: {
                files: ['components/**/*.js'],
                tasks: ['concat']
            },
            index: {
                files: ['index.html', 'desktop.html'],
                tasks: ['htmlmin']
            },
            templates: {
                files: ['components/**/*.tpl.html'],
                tasks: ['html2js', 'concat']
            },
            images: {
                files: ['images/**/*.{png,jpg,gif}'],
                tasks: ['imagemin']
            }
        }
    });

    //  load npm tasks
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');
    //  register custom tasks
    grunt.registerTask('dev', ['browserSync', 'sass', 'watch']);
    grunt.registerTask('default', ['browserSync', 'sass', 'html2js', 'concat', 'htmlmin', 'imagemin', 'watch']);
    grunt.registerTask('serve', ['browserSync', 'watch']);
    grunt.registerTask('build', ['sass', 'html2js', 'concat', 'htmlmin', 'imagemin']);
};
