(() => {
	'use strict';

	var assistance = {moduleConfig: require('./sales-wip-module-conf.js')};
	var layoutDialogTest = require('rib-itwo40-e2e').layoutDialogTest;

	describe(layoutDialogTest.testLayoutDialogTitle(assistance), () => {
		beforeAll(() =>{
			layoutDialogTest.initialize(assistance, jasmine).then(() => {// jshint ignore: line
				layoutDialogTest.openModuleBeforeTest(assistance);
			});
		});

		it(layoutDialogTest.openLayoutDialogSpec(), () => {
			var res = layoutDialogTest.testOpenLayoutDialog(assistance);
			expect(res).toEqual(true);
		});

		it(layoutDialogTest.selectLayoutSpec(), () => {
			var res = layoutDialogTest.testSelectLayout(assistance);
			expect(res).toEqual(true);
		});

		it(layoutDialogTest.selectContainerSpec(), () => {
			var res = layoutDialogTest.testSelectContainer(assistance);
			expect(res).toEqual(true);
		});

		afterAll(() => {
			layoutDialogTest.cancelDialog();
			layoutDialogTest.finalize(assistance);
		});
	});
})();
