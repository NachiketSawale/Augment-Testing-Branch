/**
 * Created by baf on 26.09.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPriceListDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment group price list entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupPriceListDetailController', ResourceEquipmentGroupPriceListDetailController);

	ResourceEquipmentGroupPriceListDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupPriceListDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1b651939c6f74c3699a9ea9391d08db0');
	}

})(angular);