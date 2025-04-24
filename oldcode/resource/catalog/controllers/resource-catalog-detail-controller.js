/**
 * Created by baf on 27.10.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource catalog entities.
	 **/
	angular.module(moduleName).controller('resourceCatalogDetailController', ResourceCatalogDetailController);

	ResourceCatalogDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCatalogDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd5983c44f2e243e4971ba9c82a73f0b0', 'resourceCatalogTranslationService');
	}

})(angular);