(() => {
	'use strict';

	var assistance = {moduleConfig: require('./sales-wip-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.moduleMainItemsAreSelectableTitle(assistance), () => {
		beforeAll(() => {
			moduleTest.initialize(assistance, jasmine).then(() => {// jshint ignore: line
				moduleTest.openModuleBeforeTest(assistance);
			});
		});

		it(moduleTest.moduleMainItemsCanBeSelectedSpec(assistance), () => {
			moduleTest.testSelectAllMainItems(assistance);
		}, moduleTest.getDurationMainItemSelectionTest(assistance));

		afterAll(() => {
			moduleTest.finalize(assistance);
		});
	});
})();
