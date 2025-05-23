// Karma configuration
// Generated on Mon May 14 2018 10:37:21 GMT+0200 (Mitteleuropäische Sommerzeit)
(function (angular) {
	'use strict';

	module.exports = function (config) {
		config.set({

			// base path that will be used to resolve all patterns (eg. files, exclude)
			basePath: '',

			// frameworks to use
			// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
			frameworks: ['jasmine'],

			// list of files / patterns to load in the browser
			files: [
				'node_modules/angular/angular.js',
				'node_modules/angular-mocks/angular-mocks.js',
				'node_modules/lodash/lodash.min.js',
				'node_modules/moment/moment.js',

				'controlling-structure-module-mocks.js',
				'controlling-structure-tests-unit-custom-equality.js',

				'../../../../../../Framework/Development/Angular-Components/utils/platform-object-helper.js',
				'../../../../../../Cloud/Development/Common/Common.Client.Web (Angular)/Cloud.Common/services/cloud-common-grid-service.js',

				'../services/generate-wizard/controlling-structure-wizard-generate-constants-service.js',
				'../services/generate-wizard/controlling-structure-wizard-generate-custom-service.js',
				'../services/generate-wizard/controlling-structure-wizard-generate-controlling-groups-service.js',
				'../services/generate-wizard/controlling-structure-wizard-generate-location-service.js',
				'../services/generate-wizard/generator/controlling-structure-generator-expression-parser-service.js',
				'../services/generate-wizard/generator/controlling-structure-generator-helper-service.js',
				'../services/generate-wizard/generator/controlling-structure-generator-metadata-service.js',
				'../services/generate-wizard/generator/controlling-structure-generator-service.js',
				'../services/controlling-structure-planned-attributes-service.js',

				'data/controlling-structure-tests-unit-data-project-locations.js',
				'data/controlling-structure-tests-unit-data-controlling-group-complete.js',
				'data/controlling-structure-tests-unit-data-common.js',
				'data/controlling-structure-tests-unit-data-provider.js',
				'data/controlling-structure-tests-unit-data-testcases.js',

				'controlling-structure-tests-unit-generator-expression-parser-service-spec.js',
				'controlling-structure-tests-unit-generation-service-spec.js',
				'controlling-structure-tests-unit-generator-helper-service-spec.js',
				'controlling-structure-tests-unit-planned-attributes-service-spec.js',
				'controlling-structure-tests-unit-generator-metadata-service-spec.js'
				// '*.js',
				// '../**/*.js'
			],

			// list of files / patterns to exclude
			exclude: [
				'../tests-e2e/**/*.*'
			],

			// preprocess matching files before serving them to the browser
			// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
			preprocessors: {},

			// test results reporter to use
			// possible values: 'dots', 'progress'
			// available reporters: https://npmjs.org/browse/keyword/karma-reporter
			reporters: ['progress'],

			// web server port
			port: 9876,

			// enable / disable colors in the output (reporters and logs)
			colors: true,

			// level of logging
			// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
			logLevel: config.LOG_INFO,

			// enable / disable watching file and executing tests whenever any file changes
			autoWatch: true,

			// start these browsers
			// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
			browsers: ['Chrome'],

			// Continuous Integration mode
			// if true, Karma captures browsers, runs the tests and exits
			singleRun: false,

			// Concurrency level
			// how many browser should be started simultaneous
			concurrency: Infinity
		});
	};
})(angular);