(function () {
	/* global jasmine */
	'use strict';

	let assistance = {moduleConfig: require('./estimate-main-module-conf.js')};
	let moduleContainerTest = require('rib-itwo40-e2e').moduleContainerTest;

	describe(moduleContainerTest.moduleContainerTestTitle(assistance), function () {
		beforeAll(function () {
			return moduleContainerTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
				return moduleContainerTest.openModuleBeforeTest(assistance).then(function () {
					return moduleContainerTest.initialSelectFirst(assistance);
				});
			});
		});

		it(moduleContainerTest.canCreateDeleteInRootContainerSpec(), function () {
			moduleContainerTest.testCreateDeleteInRootContainer(assistance);
		}, moduleContainerTest.getDurationTestModuleShouldBeOpen(assistance));

		afterAll(function () {
			moduleContainerTest.finalize(assistance);
		});
	});
})();
