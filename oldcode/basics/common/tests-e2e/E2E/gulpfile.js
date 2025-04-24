/**
 * Created by lva on 2015/4/28.
 */

'use strict';

var gulp = require('gulp'),
	gulpProtractor = require('gulp-protractor').protractor,
	clean = require('gulp-clean'),
	config = require('./config');

gulp.task('e2e', function () {
	console.log('protractor start...');

	return gulp.src(config.protractorConfig.js)
		.pipe(gulpProtractor({
			configFile: './protractor_conf.js'
		})).on('error', function (e) {
			throw e;
		});
});

gulp.task('clean', function () {
	return gulp.src('output/e2e.xml');
});

gulp.task('gulp-e2e', ['clean', 'e2e']);

