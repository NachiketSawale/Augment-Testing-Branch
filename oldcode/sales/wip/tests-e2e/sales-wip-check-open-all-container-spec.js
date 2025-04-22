(() => {
	'use strict';

	var assistance = {moduleConfig: require('./sales-wip-module-conf.js')};
	var moduleContainerTest = require('rib-itwo40-e2e').moduleContainerTest;

	describe(moduleContainerTest.moduleContainerTestTitle(assistance), () => {
		beforeAll(() => {
			moduleContainerTest.initialize(assistance, jasmine).then(() => {// jshint ignore: line
				moduleContainerTest.openModuleBeforeTest(assistance);
			});
		});

		it(moduleContainerTest.moduleContainerCanBeOpenedSpec(), () => {
			moduleContainerTest.testModuleContainerCanBeOpened(assistance);
		}, moduleContainerTest.getDurationTestModuleShouldBeOpen(assistance));

		afterAll(() => {
			moduleContainerTest.finalize(assistance);
		});
	});
})();
