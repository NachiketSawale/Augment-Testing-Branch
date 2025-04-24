/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantPricelistListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of pricelist entities.
	 **/
	angModule.controller('resourceEquipmentPlantPricelistListController', ResourceEquipmentPricelistListController);

	ResourceEquipmentPricelistListController.$inject = ['$scope','platformContainerControllerService','platformMainControllerService','resourceEquipmentPlantPricelistDataService','resourceEquipmentPlantDataService'];

	function ResourceEquipmentPricelistListController($scope, platformContainerControllerService, platformMainControllerService, resourceEquipmentPlantPricelistDataService, resourceEquipmentPlantDataService) {
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
						platformMainControllerService.commitAndUpdate(resourceEquipmentPlantDataService)().then(function (promise) {
							resourceEquipmentPlantPricelistDataService.calculatePricelist();
						});
					},
					disabled: function () {
					}
				}
			]
		});
	}
})();