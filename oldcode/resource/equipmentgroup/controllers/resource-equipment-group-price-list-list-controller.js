/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPriceListListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment group price list entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupPriceListListController', ResourceEquipmentGroupPriceListListController);

	ResourceEquipmentGroupPriceListListController.$inject = ['$scope', 'platformContainerControllerService', 'platformMainControllerService', 'resourceEquipmentGroupDataService', 'resourceEquipmentGroupPriceListDataService'];

	function ResourceEquipmentGroupPriceListListController($scope, platformContainerControllerService,platformMainControllerService,resourceEquipmentGroupDataService,resourceEquipmentGroupPriceListDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'aac8d525517c44d794c5ddd7cf406527');
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
							resourceEquipmentGroupPriceListDataService.calculatePricelist();
						});
						},
					disabled: function () {
					}
				}
			]
		});
	}
})(angular);