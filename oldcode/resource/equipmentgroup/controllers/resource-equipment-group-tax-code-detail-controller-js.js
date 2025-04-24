/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupTaxCodeListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of Resource Group TaxCode entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupTaxCodeDetailController', ResourceEquipmentGroupTaxCodeDetailController);

	ResourceEquipmentGroupTaxCodeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupTaxCodeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3bf917481bfe4b0aaa3dd4a39e03508a');
	}
})(angular);