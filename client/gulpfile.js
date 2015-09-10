'use strict';

var gulp 		    = require('gulp'),
  concat        = require('gulp-concat'),
  bower         = require('gulp-bower'),
	sourcemaps 	  = require('gulp-sourcemaps'),
	uglify 		    = require('gulp-uglify'),
	gulpif 		    = require('gulp-if'),
  fileinclude   = require('gulp-file-include'),
  minifyCss     = require('gulp-minify-css');

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


gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(minifyCss())
    .pipe(concat('BitMonster.css'))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('watch', ['default'], function () {
  gulp.watch(['./src/*.js', './src/**/*.js'], ['js']);
  gulp.watch(['./src/*.css', './src/**/*.css'], ['minify-css']);
});


gulp.task('debug', function() {
	debug = true;
});

gulp.task('default', ['minify-css', 'bower', 'js'], function() {

});