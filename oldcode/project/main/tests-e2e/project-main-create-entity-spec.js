(function () {

	'use strict';
	var basicModuleTest = require('rib-itwo40-e2e').moduleTestBasics;
	var entityTest = require('rib-itwo40-e2e').entityTest;
	var projectTest = require('./pageObjects/project-main-tests-e2e-create-dialog.js');
	var assistance = {moduleConfig: require('./project-main-module-conf.js')};

	describe('Project Creation Test', function () {
		var result = {open: false, created: false};
		beforeAll(function () {
			return basicModuleTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
				return basicModuleTest.openModuleBeforeTest(assistance);
			});
		});

		it('Can create a Project Record', function () {
			projectTest.createProjectEntity(assistance, result).then(function () {
				entityTest.testDeleteEntityInGrid(assistance.moduleConfig.container[0].uid, assistance).then(function () {
					expect(result.created).toBe(true);
					assistance.logger.addTestResult(assistance.moduleConfig, {
						message: 'Project could be created',
						containerName: 'Project Main',
						containerUid: assistance.moduleConfig.container[0].uid,
						result: result.created
					});
				});

			});
		});

		afterAll(function () {
			basicModuleTest.finalize(assistance);
		});
	});

})();
