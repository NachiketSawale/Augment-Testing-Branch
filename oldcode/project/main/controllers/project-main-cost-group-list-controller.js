/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCostGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main costGroup entities.
	 **/

	angular.module(moduleName).controller('projectMainCostGroupListController', ProjectMainCostGroupListController);

	ProjectMainCostGroupListController.$inject = ['$scope', 'platformContainerControllerService', 'projectMainCostGroupDataService', 'boqMainCrbService'];

	function ProjectMainCostGroupListController($scope, platformContainerControllerService, projectMainCostGroupDataService, boqMainCrbService) {
		platformContainerControllerService.initController($scope, moduleName, 'e1f73b4dbf484db98db890921790c6d6');

		boqMainCrbService.attachCrbCostGroupLogic($scope, projectMainCostGroupDataService);
	}
})(angular);
