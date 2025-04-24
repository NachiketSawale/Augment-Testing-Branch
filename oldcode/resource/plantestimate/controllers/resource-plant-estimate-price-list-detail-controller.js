/**
 * Created by baf on 2023-08-11.
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimatePriceListDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Resource Equipment PlantEstimatePriceList entities.
	 **/

	angular.module(moduleName).controller('resourcePlantEstimatePriceListDetailController', ResourcePlantEstimatePriceListDetailController);

	ResourcePlantEstimatePriceListDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourcePlantEstimatePriceListDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '968ff95930cc46e0946d043a4ec08ddc');
	}
})(angular);