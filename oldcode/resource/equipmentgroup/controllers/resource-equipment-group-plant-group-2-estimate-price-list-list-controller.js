/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantGroup2EstimatePriceListListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Resource EquipmentGroup PlantGroup2EstimatePriceList entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupPlantGroup2EstimatePriceListListController', ResourceEquipmentGroupPlantGroup2EstimatePriceListListController);

	ResourceEquipmentGroupPlantGroup2EstimatePriceListListController.$inject = [
		'$scope', 'platformContainerControllerService', 'platformMainControllerService', 'resourceEquipmentGroupDataService',
		'resourceEquipmentGroupPlantGroup2EstimatePriceListDataService'
	];

	function ResourceEquipmentGroupPlantGroup2EstimatePriceListListController(
		$scope, platformContainerControllerService, platformMainControllerService, resourceEquipmentGroupDataService,
		resourceEquipmentGroupPlantGroup2EstimatePriceListDataService

	) {
		platformContainerControllerService.initController($scope, moduleName, '836f9e2bf22c4aacb210635cfaa32571');
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
						platformMainControllerService.commitAndUpdate(resourceEquipmentGroupDataService)().then(function (promise) {
							resourceEquipmentGroupPlantGroup2EstimatePriceListDataService.calculatePricelist();
						});
					},
					disabled: function () {
					}
				}
			]
		});
	}
})(angular);