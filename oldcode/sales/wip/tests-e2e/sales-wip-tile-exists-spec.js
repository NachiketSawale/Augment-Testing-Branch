(() => {
	'use strict';

	var assistance = {moduleConfig: require('./sales-wip-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.desktopTileExistsTestTitle(assistance), () => {
		beforeAll(() => {
			moduleTest.initialize(assistance, jasmine).then(() => {// jshint ignore: line
				moduleTest.prepareModuleTileTest(assistance);
			});
		});

		it(moduleTest.desktopHasTilesTestSpec(assistance), () => {
			var res = moduleTest.testDesktopTilesExist(assistance);
			expect(res).toEqual(true);
		});

		it(moduleTest.desktopHasModuleTileTestSpec(assistance), () => {
			var res = moduleTest.testDesktopHasModuleTile(assistance);
			expect(res).toEqual(true);
		});

		afterAll(() => {
			moduleTest.finalize(assistance);
		});
	});
})();
