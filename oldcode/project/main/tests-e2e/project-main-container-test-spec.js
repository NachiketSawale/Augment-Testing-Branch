(function () {
	'use strict';

	var assistance = {moduleConfig: require('./project-main-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;
	var gridTest = require('rib-itwo40-e2e').helper.grid;
	var toolbarTest = require('rib-itwo40-e2e').toolbarTest;
	var formTest = require('rib-itwo40-e2e').formTest;
	var layoutHelper = require('rib-itwo40-e2e').helper.layout;
	var projectContainerUuid = assistance.moduleConfig.container[0].uid;
	var projectContainerDetails = assistance.moduleConfig.container[0].dependent[0].uid;

	describe('should load project', function () {

		beforeAll(function () {
			return moduleTest.initialize(assistance, jasmine).then(function () {// jshint ignore: line
				return moduleTest.openModuleBeforeTest(assistance);
			});
		});

		it('should select project main container and it´s details', function () {
			layoutHelper.selectContainer([projectContainerUuid, projectContainerDetails], assistance);
		});

		it('should load the mainItems', function () {
			moduleTest.testLoadMainItems();
		});

		it('should check if the project grid exists', function () {
			gridTest.testGridExists(projectContainerUuid);
		});

		it('should check if the project detail form exists', function () {
			formTest.testFormExist(projectContainerDetails);
		});

		it('should check if the toolbarItems of the grid and detail container are available', function () {
			toolbarTest.testToolbarItemsExist(projectContainerUuid);
			toolbarTest.testToolbarItemsExist(projectContainerDetails);
		});

		afterAll(function () {
			moduleTest.finalize(assistance);
		});
	});
})();










