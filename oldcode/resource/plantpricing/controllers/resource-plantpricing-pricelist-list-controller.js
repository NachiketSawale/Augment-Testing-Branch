/**
 * Created by chin-han.lai on 07/07/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingPricelistListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource plantpricing pricelist entities.
	 **/

	angular.module(moduleName).controller('resourcePlantpricingPricelistListController', ResourcePlantpricingPricelistListController);

	ResourcePlantpricingPricelistListController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantpricingConstantValues'];

	function ResourcePlantpricingPricelistListController($scope, platformContainerControllerService, resourcePlantpricingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantpricingConstantValues.uuid.container.pricelistList);
	}
})(angular);