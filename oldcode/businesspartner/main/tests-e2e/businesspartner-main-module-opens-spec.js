(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,require,describe,beforeAll,jasmine,it,afterAll,expect */

	var assistance = {moduleConfig: require('./businesspartner-main-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.desktopModuleOpensTestTitle(assistance), function () {
		beforeAll(function () {
			moduleTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
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