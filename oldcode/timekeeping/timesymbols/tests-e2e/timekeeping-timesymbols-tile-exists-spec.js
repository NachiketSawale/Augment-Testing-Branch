(function () {
	'use strict';

	let assistance = {moduleConfig: require('./timekeeping-timesymbols-module-conf.js')};
	let moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.desktopTileExistsTestTitle(assistance), function () {
		beforeAll(function () {
			moduleTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
				moduleTest.prepareModuleTileTest(assistance);
			});
		});

		it(moduleTest.desktopHasTilesTestSpec(assistance), function () {
			let res = moduleTest.testDesktopTilesExist(assistance);
			expect(res).toEqual(true);
		});

		it(moduleTest.desktopHasModuleTileTestSpec(assistance), function () {
			let res = moduleTest.testDesktopHasModuleTile(assistance);
			expect(res).toEqual(true);
		});

		afterAll(function () {
			moduleTest.finalize(assistance);
		});
	});
})();