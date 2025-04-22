(() => {
	'use strict';

	var assistance = {moduleConfig: require('./sales-wip-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.desktopModuleOpensTestTitle(assistance), () => {
		beforeAll(() => {
			moduleTest.initialize(assistance, jasmine).then(function() {// jshint ignore: line
				moduleTest.prepareModuleTileTest(assistance);
			});
		});

		it(moduleTest.moduleShouldBeOpenSpec(assistance), () => {
			var res = moduleTest.testOpenModule(assistance);
			expect(res).toEqual(true);
		});

		afterAll(() => {
			moduleTest.finalize(assistance);
		});
	});
})();
