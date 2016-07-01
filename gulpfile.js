'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const buildPath = 'dist/';

gulp.task('minify', function () {
	return gulp.src(['src/sjs.js'])
		.pipe($.babel())
		.pipe($.uglifyjs('sjs.min.js'))
		.pipe(gulp.dest(buildPath));
});

gulp.task('babel', function () {
	return gulp.src(['src/sjs.js'])
		.pipe($.babel())
		.pipe(gulp.dest(buildPath));
});

gulp.task('default', ['minify', 'babel']);

gulp.task('watch', function () {
	gulp.watch(['src/sjs.js'], ['minify', 'babel']);
});
