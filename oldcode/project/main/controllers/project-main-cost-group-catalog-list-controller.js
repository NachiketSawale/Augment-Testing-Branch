/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCostGroupCatalogListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main costGroupCatalog entities.
	 **/

	angular.module(moduleName).controller('projectMainCostGroupCatalogListController', ProjectMainCostGroupCatalogListController);

	ProjectMainCostGroupCatalogListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainCostGroupCatalogListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '02a8e37bada946f9939ce17f551cab6d');
	}
})(angular);