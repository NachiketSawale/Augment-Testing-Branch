(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global require,describe,beforeAll,jasmine,it,afterAll,expect */

	let assistance = {moduleConfig: require('./businesspartner-evaluationschema-module-conf.js')};
	let layoutDialogTest = require('rib-itwo40-e2e').layoutDialogTest;

	describe(layoutDialogTest.testLayoutDialogTitle(assistance), function () {
		beforeAll(function () {
			layoutDialogTest.initialize(assistance, jasmine).then(function() {// jshint ignore: line
				layoutDialogTest.openModuleBeforeTest(assistance);
			});
		});

		it(layoutDialogTest.openLayoutDialogSpec(), function () {
			let res = layoutDialogTest.testOpenLayoutDialog(assistance);// result
			expect(res).toEqual(true);
		});

		it(layoutDialogTest.selectLayoutSpec(), function () {
			let res = layoutDialogTest.testSelectLayout(assistance);
			expect(res).toEqual(true);
		});

		it(layoutDialogTest.selectContainerSpec(), function () {
			let res = layoutDialogTest.testSelectContainer(assistance);
			expect(res).toEqual(true);
		});

		afterAll(function () {
			layoutDialogTest.cancelDialog();
			layoutDialogTest.finalize(assistance);
		});
	});
})();