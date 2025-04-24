(function () {
	'use strict';

	var assistance = {moduleConfig: require('./basics-controllingcostcodes-module-conf.js')};
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