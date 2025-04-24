/**
 * Created by baf on 05.07.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingPricelistTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource plantpricing pricelistType entities.
	 **/
	angular.module(moduleName).controller('resourcePlantpricingPricelistTypeDetailController', ResourcePlantpricingPricelistTypeDetailController);

	ResourcePlantpricingPricelistTypeDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantpricingConstantValues'];

	function ResourcePlantpricingPricelistTypeDetailController($scope, platformContainerControllerService, resourcePlantpricingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantpricingConstantValues.uuid.container.pricelistTypeDetails);
	}

})(angular);