(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,require,describe,beforeAll,jasmine,it,afterAll */
	var assistance = {moduleConfig: require('./businesspartner-main-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.moduleMainItemsAreSelectableTitle(assistance), function () {
		beforeAll(function () {
			moduleTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
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