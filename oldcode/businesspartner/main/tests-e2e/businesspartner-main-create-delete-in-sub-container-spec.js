(function () {
	/* global jasmine */
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,require,describe,beforeAll,it,afterAll */

	var assistance = {moduleConfig: require('./businesspartner-main-module-conf.js')};
	var moduleContainerTest = require('rib-itwo40-e2e').moduleContainerTest;

	describe(moduleContainerTest.moduleContainerTestTitle(assistance), function () {
		beforeAll(function () {
			return moduleContainerTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
				return moduleContainerTest.openModuleBeforeTest(assistance).then(function () {
					return moduleContainerTest.initialSelectFirst(assistance);
				});
			});
		});

		it(moduleContainerTest.canCreateDeleteInSubContainerSpec(), function () {
			moduleContainerTest.testCreateDeleteInAllSubContainer(assistance);
		}, 10 * moduleContainerTest.getDurationTestModuleShouldBeOpen(assistance));

		afterAll(function () {
			moduleContainerTest.finalize(assistance);
		});
	});
})();