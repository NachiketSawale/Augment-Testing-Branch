/**
 * Created by baf on 15.05.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBillToListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main billTo entities.
	 **/

	angular.module(moduleName).controller('projectMainBillToListController', ProjectMainBillToListController);

	ProjectMainBillToListController.$inject = ['$scope', 'platformContainerControllerService', 'projectBillToSettingService', 'projectMainBillToDataService'];

	function ProjectMainBillToListController($scope, platformContainerControllerService, projectBillToSettingService, projectMainBillToDataService) {
		platformContainerControllerService.initController($scope, moduleName, '8f386520b10f4707936d7dbc36c976b8');
		var mainService = projectMainBillToDataService.parentService();
		projectBillToSettingService.initBillToSetting($scope, projectMainBillToDataService, mainService);
	}
})(angular);