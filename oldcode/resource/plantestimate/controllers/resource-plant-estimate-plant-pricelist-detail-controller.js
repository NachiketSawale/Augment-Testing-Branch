/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimatePlantPricelistDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant pricelist entities
	 **/
	angModule.controller('resourcePlantEstimatePlantPricelistDetailController', ResourcePlantEstimatePricelistDetailController);

	ResourcePlantEstimatePricelistDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimatePricelistDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2d915e6ca9db4c4ba1d03bb09c3aea0e');
	}
})();