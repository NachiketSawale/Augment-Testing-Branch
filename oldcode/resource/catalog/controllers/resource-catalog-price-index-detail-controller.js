/**
 * Created by baf on 07.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogPriceIndexDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource catalog priceIndex entities.
	 **/

	angular.module(moduleName).controller('resourceCatalogPriceIndexDetailController', ResourceCatalogPriceIndexDetailController);

	ResourceCatalogPriceIndexDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCatalogPriceIndexDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '85f0ed0cc8b3488297e3b411b17e5a5b');
	}
})(angular);