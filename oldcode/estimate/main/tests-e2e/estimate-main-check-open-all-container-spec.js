(function () {
	'use strict';

	let assistance = {moduleConfig: require('./estimate-main-module-conf.js')};
	let moduleContainerTest = require('rib-itwo40-e2e').moduleContainerTest;

	describe(moduleContainerTest.moduleContainerTestTitle(assistance), function () {
		beforeAll(function () {
			moduleContainerTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
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
