/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlant2EstimatePriceListDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Resource Equipment Plant2EstimatePriceList entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentPlant2EstimatePriceListDetailController', ResourceEquipmentPlant2EstimatePriceListDetailController);

	ResourceEquipmentPlant2EstimatePriceListDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentPlant2EstimatePriceListDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '968ff95930cc46e0946d043a4ec08ddc');
	}
})(angular);