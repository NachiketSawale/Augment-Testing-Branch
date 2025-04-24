/**
 * Created by nitsche on 2023-02-23.
 */
(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentSourceWindowController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('resourceEquipmentSourceWindowController', ResourceEquipmentSourceWindowController);

	ResourceEquipmentSourceWindowController.$inject = ['$scope', 'resourceEquipmentSourceWindowControllerService'];

	function ResourceEquipmentSourceWindowController($scope, resourceEquipmentSourceWindowControllerService) {

		var uuid = $scope.getContainerUUID();
		resourceEquipmentSourceWindowControllerService.initSourceFilterController($scope, uuid);
	}
})();