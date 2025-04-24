(function () {
	'use strict';

	var assistance = {moduleConfig: require('./resource-maintenance-module-conf.js')};
	var layoutDialogTest = require('rib-itwo40-e2e').layoutDialogTest;

	describe(layoutDialogTest.testLayoutDialogTitle(assistance), function () {
		beforeAll(function () {
			layoutDialogTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
				layoutDialogTest.openModuleBeforeTest(assistance);
			});
		});

		it(layoutDialogTest.openLayoutDialogSpec(), function () {
			var res = layoutDialogTest.testOpenLayoutDialog(assistance);
			expect(res).toEqual(true);
		});

		it(layoutDialogTest.selectLayoutSpec(), function () {
			var res = layoutDialogTest.testSelectLayout(assistance);
			expect(res).toEqual(true);
		});

		it(layoutDialogTest.selectContainerSpec(), function () {
			var res = layoutDialogTest.testSelectContainer(assistance);
			expect(res).toEqual(true);
		});

		afterAll(function () {
			layoutDialogTest.cancelDialog();
			layoutDialogTest.finalize(assistance);
		});
	});
})();