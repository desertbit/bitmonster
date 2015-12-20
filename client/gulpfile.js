'use strict';

var gulp 		 = require('gulp'),
    bower        = require('gulp-bower'),
    sourcemaps 	 = require('gulp-sourcemaps'),
    uglify 		 = require('gulp-uglify'),
    gulpif 		 = require('gulp-if'),
    fileinclude  = require('gulp-file-include'),
    sass 	     = require('gulp-sass');

var debug = false;


gulp.task('bower', function() {
  return bower();
});


gulp.task('js', ['bower'], function () {
  gulp.src(['src/BitMonster.js'])
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulpif(debug, sourcemaps.init()))
      .pipe(gulpif(!debug, uglify()))
    .pipe(gulpif(debug, sourcemaps.write()))
    .pipe(gulp.dest('./dist/'));
})


gulp.task('sass', function () {
  var opts = {
    outputStyle: "compressed"
  };

  var debugOpts = {
    outputStyle: "expanded"
  };

  gulp.src('src/css/*.scss')
    .pipe(gulpif(debug, sass(debugOpts).on('error', sass.logError)))
    .pipe(gulpif(!debug, sass(opts).on('error', sass.logError)))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('watch', ['debug'], function () {
  gulp.watch(['./src/*.js', './src/**/*.js'], ['js']);
  gulp.watch(['./src/*.css', './src/**/*.css'], ['sass']);
});


gulp.task('setdebug', function() {
	debug = true;
});

gulp.task('debug', ['setdebug', 'default'], function() {});
gulp.task('default', ['sass', 'bower', 'js'], function() {});
