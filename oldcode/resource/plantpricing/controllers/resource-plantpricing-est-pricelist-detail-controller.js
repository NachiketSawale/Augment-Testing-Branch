/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingEstPricelistDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource plantpricing estPricelist entities.
	 **/
	angular.module(moduleName).controller('resourcePlantpricingEstPricelistDetailController', ResourcePlantpricingEstPricelistDetailController);

	ResourcePlantpricingEstPricelistDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantpricingConstantValues'];

	function ResourcePlantpricingEstPricelistDetailController($scope, platformContainerControllerService, resourcePlantpricingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantpricingConstantValues.uuid.container.estPricelistDetails);
	}

})(angular);