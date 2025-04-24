(function (require) {
	'use strict';

	var gulp = require('gulp');
	var postcss = require('gulp-postcss');
	var sass = require('gulp-sass');
	var sourcemaps = require('gulp-sourcemaps');
	var concat = require('gulp-concat');
	var replace = require('gulp-replace');
	var noop = require('gulp-noop');

	// postcss modules
	var autoprefixer = require('autoprefixer');
	var cssnano = require('cssnano');

	// vars
	var sourcePaths = {
		cloud: 'content/css/cloud.scss',
		bootstrap: 'content/css/bootstrap/bootstrap.scss',
		lib: 'content/css/lib/*.scss',
		hacks: 'content/css-hacks/*.scss',
		icons: 'content/css/icons/*.css',
		extern: 'content/css/extern/*.scss'
	};

	var destPaths = {
		cloud: 'content/css/',
		bootstrap: 'content/css/',
		hacks: 'content/css-hacks/',
		lib: 'content/css/lib/',
		extern: 'content/css/extern/'
	};

	var outputFiles = {
		cloud: 'cloud.css',
		cloudBundled: 'cloud-min.css',
		bootstrap: 'bootstrap.css'
	};

	var debugMode = true;

	function buildCss(sources, destination, outfile, debugMode, bundleMode) {
		var postCssPlugins = [
			autoprefixer(),
			cssnano()
		];

		var stream = gulp.src(sources)
			.pipe(debugMode ? sourcemaps.init() : noop())
			.pipe(sass().on('error', sass.logError));

		if (bundleMode) {
			var regex = /(\(["']?)((?:\.\.\/)+)(images\/|fonts\/)/g;
			var regex2 = /(["']?)((?:\.\.\/)+)(cloud.style\/content\/)/g;
			stream = stream.pipe(replace(regex2, function (match, p1) {
				// to replace cloud.style path strings with correct path. It's important to do first this...
				return p1 + '../';
			}))
				.pipe(replace(regex, function (match, p1, p2, p3) {
					// to replace relative path strings with correct path
					return p1 + '../' + p3;
				}));
		}

		stream = stream.pipe(postcss(postCssPlugins))
			.pipe(outfile && bundleMode ? concat(outfile) : noop())
			.pipe(debugMode ? sourcemaps.write({includeContent: false}) : noop())
		   .pipe(gulp.dest(destination));

		return stream;
	}

	// CSS bundled
	gulp.task('bundleCss', function bundleCss() {
		return buildCss([sourcePaths.icons, sourcePaths.lib, sourcePaths.bootstrap, sourcePaths.cloud],
			destPaths.cloud, outputFiles.cloudBundled, true, true);
	});


	// Root folder - the main iTWO 4.0 css file
	gulp.task('cloud', function () {
		return buildCss(sourcePaths.cloud,
			destPaths.cloud, outputFiles.cloud, debugMode);
	});

	// Bootstrap Framework
	gulp.task('bootstrap', function () {
		return buildCss(sourcePaths.bootstrap,
			destPaths.bootstrap, outputFiles.bootstrap, debugMode);
	});

	// lib folder - external libraries
	gulp.task('lib', function () {
		return buildCss(sourcePaths.lib,
			destPaths.lib, outputFiles.lib, debugMode);
	});

	// extern folder - external styles that do not belong to the application
	gulp.task('extern', function () {
		return buildCss(sourcePaths.extern,
			destPaths.extern, outputFiles.extern, debugMode);
	});

	// Webkit - only the hack Datei for webkit browser
	gulp.task('hacks', function () {
		return buildCss(sourcePaths.hacks,
			destPaths.hacks, outputFiles.hacks, debugMode);
	});

	// unset the debug mode. This is to deploy the application.
	gulp.task('set-deploy',  function () {
		return new Promise(function(resolve) {
			debugMode = false;
			resolve();
		});
	});

	function getTasks(deployMode) {
		var tasks = ['cloud', 'bootstrap', 'lib', 'hacks', 'extern'];

		if (deployMode) {
			tasks.unshift('set-deploy');
		}

		return gulp.series(tasks);
	}

	// special task to bundle CSS
	gulp.task('bundle', gulp.series(['bundleCss']));
	// special task to deploy the css
	gulp.task('deploy', getTasks(true) );
	// default task for developer
	gulp.task('default', getTasks(false));


})(require); //jshint ignore:line
