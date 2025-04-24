(function () {
	'use strict';
	var pageObjects = require('rib-itwo40-e2e').pageObjects;
	var layoutHelper = require('rib-itwo40-e2e').helper.layout;
	var toolBar = pageObjects.toolBar;
	var utils = require('rib-itwo40-e2e').testUtilities;

	function createProject(assistance, result) {
		var config = assistance.moduleConfig;
		var generatedProjectName = utils.createUUID();
		var projectContainer = config.container[0];
		var projectContainerDetails = projectContainer.dependent[0];
		return layoutHelper.selectContainer([projectContainer, projectContainerDetails], assistance).then(function selectContainer() {
			//click new Record button
			var newRecordIcon = toolBar.getButton(config.container[0].uid, toolBar.buttons.NewRecord);
			newRecordIcon.click();
			var inputNumber = element.all(by.model('entity.ProjectNo')).last();
			inputNumber.click().sendKeys(generatedProjectName);
			var inputName = element.all(by.model('entity.ProjectName')).last();
			inputName.click().sendKeys('UI Test ProjectName');
			var inputName2 = element.all(by.model('entity.ProjectName2')).last();
			inputName2.click().sendKeys('E2E-ProjectName2');
			element.all(by.className('btn btn-default ng-binding')).first().click();
			//save new entity
			//var saveIcon = navBar.getNavbar().save;
			//saveIcon.click();
			//select sidebar and search for entity
			//sideBar.search(generatedProjectName);
			return checkEntityIsPresent(result);

		});

	}

	function checkEntityIsPresent(res) {
		var newRow = element(by.className('ui-widget-content slick-row even active'));//before grid was empty, new data is row zero => even
		return newRow.isPresent().then(function (result) {
			res.created = result;
			return true;
		});
	}

	module.exports = {
		createProjectEntity: createProject
	};
})();