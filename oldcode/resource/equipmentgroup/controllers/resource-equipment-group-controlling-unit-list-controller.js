/**
 * Created by baf on 02.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupControllingUnitListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipmentGroup controllingUnit entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupControllingUnitListController', ResourceEquipmentGroupControllingUnitListController);

	ResourceEquipmentGroupControllingUnitListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupControllingUnitListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '91b78b592b5548cea31092fe04ed94bf');
	}
})(angular);