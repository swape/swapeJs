'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const buildPath = 'dist/';

gulp.task('minify', ['babel'], function () {
	return gulp.src(['dist/sjs.js'])
		.pipe($.uglifyjs('sjs.min.js'))
		.pipe(gulp.dest(buildPath));
});

gulp.task('babel', function () {
	return gulp.src(['src/sjs.js'])
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(buildPath));
});

gulp.task('default', ['watch']);

gulp.task('watch', function () {
	gulp.watch(['src/sjs.js'], ['minify']);
});
