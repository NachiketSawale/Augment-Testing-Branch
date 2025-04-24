(function (require) {
	'use strict';

	var del = require('del');
	var process = require('process');
	var _= require('lodash');
	var gulp = require('gulp');
	var concat = require('gulp-concat');
	var newer = require('gulp-newer');
	var order = require('gulp-order');
	var log = require('fancy-log');
	var noop = require('gulp-noop');
	var cacheBuster = require('gulp-cache-bust');
	var plumber = require('gulp-plumber');
	var uglifyjs = require('uglify-js');
	var composer = require('gulp-uglify/composer');
	var minify = composer(uglifyjs, console);

	var postcss = require('gulp-postcss');
	var sass = require('gulp-sass')(require('sass'));
	var sourcemaps = require('gulp-sourcemaps');
	var replace = require('gulp-replace');

	// postcss modules
	var autoprefixer = require('autoprefixer');
	var cssnano = require('cssnano');

	var destination = '_bundle';
	var minification = false;

	var debugMode = true;
	var bundles = {
		css: {
			modules: 'modules-min.css',
			cloud: 'cloud-min.css',
			webkit: 'app-webkit-min.css',
			touch: 'app-touch-min.css'
		},
		js: {
			app01: 'app-min.js',
			mod01: 'modules-min01.js',
			mod02: 'modules-min02.js',
			mod03: 'modules-min03.js',
			mod04: 'modules-min04.js',
			mod05: 'modules-min05.js',
			lib01: 'lib-min01.js',
			lib02: 'lib-min02.js'
		},
		modules: [{
			task: 'modules01-js',
			pattern: 'ab',
			file: 'modules-min01.js'
		},{
			task: 'modules02-js',
			pattern: 'cdefghijkl',
			file: 'modules-min02.js'
		},{
			task: 'modules03-js',
			pattern: 'mno',
			file: 'modules-min03.js'
		},{
			task: 'modules04-js',
			pattern: 'p',
			file: 'modules-min04.js'
		},{
			task: 'modules05-js',
			pattern: 'qrstuvwxyz',
			file: 'modules-min05.js'
		}]
	};

	var tasks = _.map(bundles.modules, 'task').concat([
		'app-js',
		'lib01-js',
		'lib02-js',
		'cloud-css',
		'modules-css',
		'app-webkit-css-hack',
		'app-touch-css-hack',
		'cacheBuster'
	]);

	_.forEach(process.argv, function(value) {
		switch(value) {
			case '--production':
				log('setting production mode (debug: true, minification: true)');
				minification = true;
				debugMode = true;
				break;

			case '--minimize':
				log('setting minimize mode');
				minification = true;
				break;

			case '--development':
				log('setting development mode (debug: true, minification: false)');
				minification = false;
				debugMode = true;
				break;

			case '--debug':
				log('setting debug mode (debug: true)');
				debugMode = true;
				break;

			case '--nodebug':
				log('setting debug mode (debug: false)');
				debugMode = false;
				break;

			case '--clean':
				log('deleting existing output');
				del.sync([destination + '\\*']);
				break;

			default:
				if(value.startsWith('--file=')) {
					var result = value.match(/^.*\(Angular\)\\(\w+\.\w+)\\.+\.js"*$/);

					tasks.length = 0;

					if(result) {
						result = result[1][0];

						var module = _.find(bundles.modules, function(item) {
							return item.pattern.indexOf(result) !== -1;
						});

						if(module) {
							tasks.push(module.task);
						}
					}

					tasks.push('cacheBuster');
				}
				break;
		}
	});

	gulp.task('default', defaultInfo);

	gulp.task('clean', clean);

	gulp.task('app-js', appJs);
	gulp.task('lib01-js', lib01Js);
	gulp.task('lib02-js', lib02Js);
	gulp.task('modules01-js', modules01Js);
	gulp.task('modules02-js', modules02Js);
	gulp.task('modules03-js', modules03Js);
	gulp.task('modules04-js', modules04Js);
	gulp.task('modules05-js', modules05Js);

	gulp.task('cloud-css', cloudCss);
	gulp.task('modules-css', modulesCss);
	gulp.task('app-webkit-css-hack', appWebkitCssHack);
	gulp.task('app-touch-css-hack', appTouchCssHack);

	gulp.task('setProduction', setProduction);
	gulp.task('logStates', logStates);
	gulp.task('cacheBuster', function () {
		return gulp.src([
			'index.html',
			// 'index.cshtml',
			'portal.html'])
			.pipe(cacheBuster({
				type: 'timestamp'
			}))
			.pipe(gulp.dest('.'));
	});

	gulp.task('build', gulp.series('logStates', gulp.parallel.apply(null, tasks)));
	gulp.task('build-all', gulp.series('build'));
	gulp.task('rebuild-all', gulp.series('clean', 'build'));
	gulp.task('build-all-min', gulp.series('setProduction', 'build'));
	gulp.task('rebuild-all-min', gulp.series('setProduction', 'clean', 'build'));

	gulp.task('gaze', function () {
		var gaze = require('gaze');
		console.log('\x1b[32m%s\x1b[0m', 'Started gaze waiting for file changes...');
		var date, startMs;
		var bundleCnt = 0;
		if(typeof(process.argv[3]) !== 'undefined') {
			var srcList = srcListBuilder(process.argv[3].replace('--'));
			if(process.argv[3].indexOf('f') > 0) {
				srcList.push(['app/platform.js',
					'app/common/**/*.js', 'app/services/**/*.js', 'app/filters/**/*.js', 'app/directives/**/*.js', 'app/commands/**/*.js',
					'app/controllers/**/*.js', 'app/content/**/*.js', 'app/components/**/*.js']);
			}
			// watch working files
			gaze(srcList, function () {
				// var watched = this.watched();
				// console.log(watched);
				this.on('all', function (event, fp) {
					bundleCnt++;
					date = new Date();
					startMs = date.getMilliseconds();
					console.log('\x1b[1;33m' + event + '\x1b[0m => \x1b[35m'+fp+'\x1b[0m');
					if(bundleCnt === 1) {
						console.log('\x1b[36m%s\x1b[0m', '*start bundling*');
					}
					if(process.argv[3].indexOf('f') > 0) {
						appJs();
					}
					modules01Js();
					modules02Js();
					modules03Js();
					modules04Js();
					modules05Js();
				});
			});

			// watch bundled files
			gaze('_bundle/*.js', function () {
				this.on('all', function (event, fp) {
					date = new Date();
					var endMs = date.getMilliseconds();
					console.log('[bundled] ' + (endMs-startMs) + 'ms: \x1b[1;33m' + event + '\x1b[0m => \x1b[35m'+fp+'\x1b[0m');
					bundleCnt--;
					if(bundleCnt === 0) {
						console.log('\x1b[36m%s\x1b[0m', '*end bundling*');
						console.log('\x1b[32m%s\x1b[0m', 'waiting for file changes...');
					}
				});
			});
		} else {
			console.log('\x1b[31m%s\x1b[0m', 'Please define modules to watch i.e. gulp gaze --t');
		}
	});

	/**  */
	function defaultInfo() {
		var startTime = process.hrtime(); // reset the timer
		log('*******************************************************');
		log('*                                                      ');
		log('* iTWO 4.0 gulp bundler                                ');
		log('* details see wiki                                     ');
		log('* http://rib-s-wiki01.rib-software.com/cloud/wiki/1161 ');
		log('*                                                      ');
		log('*******************************************************');
		log(elapsedTime(process.hrtime(startTime)));
	}

	function setProduction(done) {
		// log('minification activated');
		minification = true;
		debugMode = true;
		done();
	}


	function logStates(done) {
		log('******* States ****************************************');
		log('debug mode: ' + debugMode);
		log('minification: ' + minification);
		log('*******************************************************');
		done();
	}

	/**
	 * @returns {*}
	 */
	function clean() {
		return del([destination + '\\*']);
	}

	/*
	 */
	function buildJs(sources, sortList, minifyflag, destination, outfile, debugMode, checkfile) {
		return gulp.src(sources)
			.pipe(plumber())
			.pipe(newer(destination + '\\' + (checkfile || outfile)))
			.pipe(sortList ? order(sortList) : noop())
			.pipe(debugMode ? sourcemaps.init() : noop())
			.pipe(debugMode && minifyflag ? minify() : noop())
			.pipe(concat(outfile))
			.pipe(!debugMode && minifyflag ? minify() : noop())
			.pipe(debugMode ? sourcemaps.write('.') : noop())
			.pipe(gulp.dest(destination));
	}

	/**
	 */
	function buildCss(sources, destination, outfile, minifyflag, debugMode) {
		var postCssPlugins = [
			autoprefixer()
		];

		if (minifyflag) {
			postCssPlugins.push(cssnano());
		}

		var regex = /(\(["']?)((?:\.\.\/)+)(images\/|fonts\/)/g;
		var regex2 = /(["']?)((?:\.\.\/)+)(cloud.style\/content\/)/g;

		return gulp.src(sources)
			.pipe(plumber())
			// .pipe(newer(destination + '\\' + outfile))
			.pipe(debugMode ? sourcemaps.init() : noop())
			.pipe(sass().on('error', sass.logError))
			.pipe(replace(regex2, function (match, p1) {
				// to replace cloud.style path strings with correct path
				return p1 + '../cloud.style/content/';
			}))
			.pipe(replace(regex, function (match, p1, p2, p3) {
				// to replace relative path strings with correct path
				return p1 + '../cloud.style/content/' + p3;
			}))
			.pipe(postcss(postCssPlugins))
			.pipe(concat(outfile))
			.pipe(debugMode ? sourcemaps.write('.') : noop())
			.pipe(gulp.dest(destination));
	}

	function srcListBuilder(prefixPattern) {
		var listOfFolders =	[
			'%pre%*.*/*.js',
			'%pre%*.*/lib/**/*.js',
			'%pre%*.*/common/**/*.js',
			'%pre%*.*/services/**/*.js',
			'%pre%*.*/filters/**/*.js',
			'%pre%*.*/directives/**/*.js',
			'%pre%*.*/commands/**/*.js',
			'%pre%*.*/controllers/**/*.js',
			'%pre%*.*/content/**/*.js',
			'!*.*/**/gulpfile.js',
			'!*.*/*module.js'
		];

		var resultSrv = [];
		if (prefixPattern) {
			_.forEach(prefixPattern, function (sChar){
				_.forEach(listOfFolders, function (folder){
					var newFolder =  folder.replace('%pre%',sChar);
					resultSrv.push (newFolder);
				});
			});

			return resultSrv;
		}
		return null;
	}

	function modules01Js(cb) {
		var srcListArr = srcListBuilder('ab');
		return buildJs(
			srcListArr,
			undefined /* sortList */,
			minification, destination, bundles.js.mod01, debugMode, cb);
	}

	function modules02Js(cb) {
		var srcListArr = srcListBuilder('cdefghijkl');
		return buildJs(
			srcListArr,
			undefined /* sortList */,
			minification, destination, bundles.js.mod02, debugMode, cb);
	}

	function modules03Js(cb) {
		var srcListArr = srcListBuilder('mno');
		return buildJs(
			srcListArr,
			undefined /* sortList */,
			minification, destination, bundles.js.mod03, debugMode, cb);
	}

	function modules04Js(cb) {
		var srcListArr = srcListBuilder('p');
		return buildJs(
			srcListArr,
			undefined /* sortList */,
			minification, destination, bundles.js.mod04, debugMode, cb);
	}

	function modules05Js(cb) {
		var srcListArr = srcListBuilder('qrstuvwxyz');
		srcListArr.push('app/app.js');
		return buildJs(
			srcListArr,
			undefined /* sortList */,
			minification, destination, bundles.js.mod05, debugMode, cb);
	}

	function lib01Js(cb) {
		var fn = buildJs(
			['lib/**/*.js', '!lib/**/*-min.js'],
			['lib/**/*.js'], /* sortList */
			minification, destination, bundles.js.lib01, debugMode, cb);
		return fn;
	}

	function lib02Js(cb) {
		var fn = buildJs(
			['lib/**/*-min.js'],
			['lib/**/*.js'], /* sortList */
			false, destination, bundles.js.lib02, false, cb);

		return fn;
	}

	function appJs(cb) {
		return buildJs([
			'app/platform.js',
			'app/common/**/*.js',
			'app/services/**/*.js',
			'app/filters/**/*.js',
			'app/directives/**/*.js',
			'app/commands/**/*.js',
			'app/controllers/**/*.js',
			'app/content/**/*.js',
			'app/components/**/*.js',
			'*.*/*module.js'
		],
		undefined /* sortList */,
		minification, destination, bundles.js.app01, debugMode, cb);
	}

	/**
	 */
	function cloudCss() {
		var sourcePaths = {
			cloud: 'cloud.style/content/css/cloud.scss',
			bootstrap: 'cloud.style/content/css/bootstrap/bootstrap.scss',
			lib: 'cloud.style/content/css/lib/*.scss',
			icons: 'cloud.style/content/css/icons/*.css'
		};

		return buildCss([sourcePaths.icons, sourcePaths.lib, sourcePaths.bootstrap, sourcePaths.cloud],
			destination, bundles.css.cloud, minification, debugMode);
	}

	/**
	 */
	function modulesCss() {
		return buildCss([
			'*.*/content/css/icons/*.css', '*.*/content/css/lib/*.css', '*.*/content/css/**/*.css', '!cloud.style/**/*.css'
		],
		destination, bundles.css.modules, minification, debugMode);
	}

	/**
	 */
	function appWebkitCssHack() {
		return buildCss(['cloud.style/content/css-hacks/webkit.scss'],
			destination, bundles.css.webkit, minification, debugMode);
	}

	/**
	 */
	function appTouchCssHack() {
		return buildCss(['cloud.style/content/css-hacks/touch.scss'],
			destination, bundles.css.touch, minification, debugMode);
	}

	/**
	 *
	 * @param timer
	 * @param resettimer
	 * @returns {string}
	 */
	function elapsedTime(elapsedtime) {
		var precision = 1; // 3 decimal places
		var elapsed = elapsedtime[1] / 1000000; // divide by a million to get nano to milli
		var time = (elapsedtime[0] > 0 ? elapsedtime[0] + 's ' : '') + elapsed.toFixed(precision) + 'ms'; // print message + time
		return time;
	}
})(require); // jshint ignore:line
