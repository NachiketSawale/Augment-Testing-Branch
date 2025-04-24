/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingEstPricelistListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource plantpricing estPricelist entities.
	 **/

	angular.module(moduleName).controller('resourcePlantpricingEstPricelistListController', ResourcePlantpricingEstPricelistListController);

	ResourcePlantpricingEstPricelistListController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantpricingConstantValues'];

	function ResourcePlantpricingEstPricelistListController($scope, platformContainerControllerService, resourcePlantpricingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantpricingConstantValues.uuid.container.estPricelistList);
	}
})(angular);