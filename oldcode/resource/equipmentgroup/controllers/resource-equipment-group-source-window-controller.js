/**
 * Created by nitsche on 2023-02-23.
 */
(function () {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupSourceWindowController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupSourceWindowController', ResourceEquipmentGroupSourceWindowController);

	ResourceEquipmentGroupSourceWindowController.$inject = ['$scope', 'resourceEquipmentGroupSourceWindowControllerService'];

	function ResourceEquipmentGroupSourceWindowController($scope, resourceEquipmentGroupSourceWindowControllerService) {

		var uuid = $scope.getContainerUUID();
		resourceEquipmentGroupSourceWindowControllerService.initSourceFilterController($scope, uuid);
	}
})();