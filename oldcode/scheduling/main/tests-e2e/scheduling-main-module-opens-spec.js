/* eslint-disable */ // This is a test configuration therefore no ESLint validation
(function () {
	'use strict';

	var assistance = {moduleConfig: require('./scheduling-main-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

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
