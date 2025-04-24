(function () {
	/* global jasmine */
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global require,describe,beforeAll,it,afterAll */

	let assistance = {moduleConfig: require('./businesspartner-evaluationschema-module-conf.js')};
	let moduleContainerTest = require('rib-itwo40-e2e').moduleContainerTest;

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