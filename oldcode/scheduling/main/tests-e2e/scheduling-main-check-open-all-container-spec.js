/* eslint-disable */ // This is a test configuration therefore no ESLint validation
(function () {
	'use strict';

	var assistance = {moduleConfig: require('./scheduling-main-module-conf.js')};
	var moduleContainerTest = require('rib-itwo40-e2e').moduleContainerTest;

	describe(moduleContainerTest.moduleContainerTestTitle(assistance), function () {
		beforeAll(function () {
			moduleContainerTest.initialize(assistance, jasmine).then(function() {// jshint ignore: line
				moduleContainerTest.openModuleBeforeTest(assistance);
			});
		});

		it(moduleContainerTest.moduleContainerCanBeOpenedSpec(), function () {
			moduleContainerTest.testModuleContainerCanBeOpened(assistance);
		}, moduleContainerTest.getDurationTestModuleShouldBeOpen(assistance));

		afterAll(function () {
			moduleContainerTest.finalize(assistance);
		});
	});
})();
