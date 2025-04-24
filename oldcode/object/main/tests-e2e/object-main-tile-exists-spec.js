(function () {
	'use strict';

	var assistance = {moduleConfig: require('./object-main-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;

	describe(moduleTest.desktopTileExistsTestTitle(assistance), function () {
		beforeAll(function () {
			moduleTest.initialize(assistance, jasmine).then(function() {// jshint ignore: line
				moduleTest.prepareModuleTileTest(assistance);
			});
		});

		it(moduleTest.desktopHasTilesTestSpec(assistance), function () {
			var res = moduleTest.testDesktopTilesExist(assistance);
			expect(res).toEqual(true);
		});

		it(moduleTest.desktopHasModuleTileTestSpec(assistance), function () {
			var res = moduleTest.testDesktopHasModuleTile(assistance);
			expect(res).toEqual(true);
		});

		afterAll(function () {
			moduleTest.finalize(assistance);
		});
	});
})();
