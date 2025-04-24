'use strict';

var fw = require('framework');
var reporter;
var config = require('./config');

exports.config = {
	directConnect: true,

	capabilities: {
		'browserName': 'chrome'
	},

	framework: 'jasmine2',
	port: '55443',

	// Spec patterns are relative to the current working directly when
	// protractor is called.
	specs: config.protractorConfig.js,

	onPrepare: function () {
		fw.locator(protractor);

		var jasmineReporter = require('rib-reporters');
		reporter = new jasmineReporter.JUnitXmlReporter({
			savePath: './output/',
			consolidateAll: true,
			filePrefix: 'e2e'
		});

		jasmine.getEnv().addReporter(reporter);
		browser.driver.manage().window().maximize();
	},

	jasmineNodeOpts: {
		onComplete: null,
		isVerbose: true,
		includeStackTrace: true,
		showColors: true,
		defaultTimeoutInterval: 800000
	},

	allScriptsTimeout: 600000
};
