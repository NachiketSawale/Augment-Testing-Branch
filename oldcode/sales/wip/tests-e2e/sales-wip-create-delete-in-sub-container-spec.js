(() => {
	/* global jasmine */
	'use strict';

	var assistance = {moduleConfig: require('./sales-wip-module-conf.js')};
	var moduleContainerTest = require('rib-itwo40-e2e').moduleContainerTest;

	describe(moduleContainerTest.moduleContainerTestTitle(assistance), () => {
		beforeAll(() => {
			return moduleContainerTest.initialize(assistance, jasmine).then(() => {// jshint ignore: line
				return moduleContainerTest.openModuleBeforeTest(assistance).then(() => {
					return moduleContainerTest.initialSelectFirst(assistance);
				});
			});
		});

		it(moduleContainerTest.canCreateDeleteInSubContainerSpec(), () => {
			moduleContainerTest.testCreateDeleteInAllSubContainer(assistance);
		}, 10 * moduleContainerTest.getDurationTestModuleShouldBeOpen(assistance));

		afterAll(() => {
			moduleContainerTest.finalize(assistance);
		});
	});
})();
