(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global require,describe,beforeAll,jasmine,it,afterAll,expect */

	let assistance = {moduleConfig: require('./businesspartner-evaluationschema-module-conf.js')};
	let moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.desktopModuleOpensTestTitle(assistance), function () {
		beforeAll(function () {
			moduleTest.initialize(assistance, jasmine).then(function() {// jshint ignore: line
				moduleTest.prepareModuleTileTest(assistance);
			});
		});

		it(moduleTest.moduleShouldBeOpenSpec(assistance), function () {
			var res = moduleTest.testOpenModule(assistance);
			expect(res).toEqual(true);
		});

		afterAll(function () {
			moduleTest.finalize(assistance);
		});
	});
})();