/**
 * Created by baf on 07.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogPriceIndexListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource catalog priceIndex entities.
	 **/
	angular.module(moduleName).controller('resourceCatalogPriceIndexListController', ResourceCatalogPriceIndexListController);

	ResourceCatalogPriceIndexListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCatalogPriceIndexListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '99a21ea527b44736892593accc5e6b6f');
	}

})(angular);