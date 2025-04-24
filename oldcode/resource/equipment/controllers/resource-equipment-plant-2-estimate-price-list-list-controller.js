/**
 * Created by nitsche on 25.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlant2EstimatePriceListListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Resource Equipment Plant2EstimatePriceList entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentPlant2EstimatePriceListListController', ResourceEquipmentPlant2EstimatePriceListListController);

	ResourceEquipmentPlant2EstimatePriceListListController.$inject = [
		'$scope', 'platformContainerControllerService','platformMainControllerService', 'resourceEquipmentPlantDataService',
		'resourceEquipmentPlant2EstimatePriceListDataService'
	];

	function ResourceEquipmentPlant2EstimatePriceListListController(
		$scope, platformContainerControllerService, platformMainControllerService, resourceEquipmentPlantDataService,
		resourceEquipmentPlant2EstimatePriceListDataService
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
						platformMainControllerService.commitAndUpdate(resourceEquipmentPlantDataService)().then(function (promise) {
							resourceEquipmentPlant2EstimatePriceListDataService.calculatePricelist();
						});
					},
					disabled: function () {
					}
				}
			]
		});
	}
})(angular);