/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimatePlantPricelistListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of pricelist entities.
	 **/
	angModule.controller('resourcePlantEstimatePlantPricelistListController', ResourcePlantEstimatePricelistListController);

	ResourcePlantEstimatePricelistListController.$inject = ['$scope','platformContainerControllerService','platformMainControllerService','resourcePlantEstimateEquipmentPricelistDataService','resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimatePricelistListController($scope, platformContainerControllerService, platformMainControllerService, resourcePlantEstimateEquipmentPricelistDataService, resourcePlantEstimateEquipmentDataService) {
		platformContainerControllerService.initController($scope, moduleName, '2e0de4514e1e4873b5c650edbe6f2c41');

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 'pricelist-calculate',
					caption: 'resource.equipment.pricelistCalculate',
					iconClass: 'control-icons ico-recalculate',
					type: 'item',
					sort: 100,
					fn: function () {
						platformMainControllerService.commitAndUpdate(resourcePlantEstimateEquipmentDataService)().then(function (promise) {
							resourcePlantEstimateEquipmentPricelistDataService.calculatePricelist();
						});
					},
					disabled: function () {
					}
				}
			]
		});
	}
})();