/**
 * Created by baf on 27.10.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';
	/**
	 * @ngdoc controller
	 * @name resourceCatalogListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource catalog entities.
	 **/
	angular.module(moduleName).controller('resourceCatalogListController', ResourceCatalogListController);

	ResourceCatalogListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCatalogListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd6267b2141db4c6f831d20c3f95f48f9');
	}
})(angular);