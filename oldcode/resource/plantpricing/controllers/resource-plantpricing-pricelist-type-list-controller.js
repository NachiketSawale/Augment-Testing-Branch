/**
 * Created by baf on 05.07.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingPricelistTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource plantpricing pricelistType entities.
	 **/

	angular.module(moduleName).controller('resourcePlantpricingPricelistTypeListController', ResourcePlantpricingPricelistTypeListController);

	ResourcePlantpricingPricelistTypeListController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantpricingConstantValues'];

	function ResourcePlantpricingPricelistTypeListController($scope, platformContainerControllerService, resourcePlantpricingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantpricingConstantValues.uuid.container.pricelistTypeList);
	}
})(angular);