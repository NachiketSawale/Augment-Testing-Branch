/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantGroup2EstimatePriceListDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Resource EquipmentGroup PlantGroup2EstimatePriceList entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupPlantGroup2EstimatePriceListDetailController', ResourceEquipmentGroupPlantGroup2EstimatePriceListDetailController);

	ResourceEquipmentGroupPlantGroup2EstimatePriceListDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupPlantGroup2EstimatePriceListDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'cf168a5f73d3417ebea644f92dff46d3');
	}
})(angular);