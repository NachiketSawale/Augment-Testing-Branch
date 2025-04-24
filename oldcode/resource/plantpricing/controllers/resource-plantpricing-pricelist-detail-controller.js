/**
 * Created by chin-han.lai on 07/07/2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingPricelistDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource plantpricing pricelist entities.
	 **/
	angular.module(moduleName).controller('resourcePlantpricingPricelistDetailController', ResourcePlantpricingPricelistDetailController);

	ResourcePlantpricingPricelistDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantpricingConstantValues'];

	function ResourcePlantpricingPricelistDetailController($scope, platformContainerControllerService, resourcePlantpricingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantpricingConstantValues.uuid.container.pricelistDetails);
	}

})(angular);