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
	 * Controller for the list view of Resource Group TaxCode entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupTaxCodeListController', ResourceEquipmentGroupTaxCodeListController);

	ResourceEquipmentGroupTaxCodeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupTaxCodeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0d881efb6e4249718bb5a7a84dad8eb1');
	}
})(angular);