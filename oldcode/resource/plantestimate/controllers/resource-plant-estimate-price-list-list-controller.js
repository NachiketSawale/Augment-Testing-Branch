/**
 * Created by baf on 2023-08-11.
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimatePriceListListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Resource Equipment PlantEstimatePriceList entities.
	 **/

	angular.module(moduleName).controller('resourcePlantEstimatePriceListListController', ResourcePlantEstimatePriceListListController);

	ResourcePlantEstimatePriceListListController.$inject = [
		'$scope', 'platformContainerControllerService','platformMainControllerService', 'resourcePlantEstimateEquipmentDataService',
		'resourcePlantEstimatePriceListDataService'
	];

	function ResourcePlantEstimatePriceListListController(
		$scope, platformContainerControllerService, platformMainControllerService, resourcePlantEstimateEquipmentDataService,
		resourcePlantEstimatePriceListDataService
	) {
		platformContainerControllerService.initController($scope, moduleName, '341542acb5594af784726a65fba10dbc');
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
					fn: function(){
						platformMainControllerService.commitAndUpdate(resourcePlantEstimateEquipmentDataService)().then(function (promise) {
							resourcePlantEstimatePriceListDataService.calculatePricelist();
						});
					},
					disabled: function () {
					}
				}
			]
		});
	}
})(angular);