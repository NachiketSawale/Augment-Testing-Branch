/**
 * Created by baf on 04.07.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCostGroupCatalogDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main costGroupCatalog entities.
	 **/
	angular.module(moduleName).controller('projectMainCostGroupCatalogDetailController', ProjectMainCostGroupCatalogDetailController);

	ProjectMainCostGroupCatalogDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainCostGroupCatalogDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9ff91fd62965439d95102a1a62b48741');
	}

})(angular);