/* eslint-disable */ // This is a test configuration therefore no ESLint validation
(function () {
	'use strict';

	var assistance = {moduleConfig: require('./scheduling-main-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.moduleMainItemsAreSelectableTitle(assistance), function () {
		beforeAll(function () {
			moduleTest.initialize(assistance, jasmine).then(function() {// jshint ignore: line
				moduleTest.openModuleBeforeTest(assistance);
			});
		});

		it(moduleTest.moduleMainItemsCanBeSelectedSpec(assistance), function () {
			moduleTest.testSelectAllMainItems(assistance);
		}, moduleTest.getDurationMainItemSelectionTest(assistance));

		afterAll(function () {
			moduleTest.finalize(assistance);
		});
	});
})();
