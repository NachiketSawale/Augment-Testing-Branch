/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipmentgroup';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupWorkOrderTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of eurolist entities.
	 **/
	angModule.controller('resourceEquipmentGroupWorkOrderTypeListController', ResourceEquipmentGroupWorkOrderTypeListController);

	ResourceEquipmentGroupWorkOrderTypeListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentGroupWorkOrderTypeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd7a7913fcf27457eb7db277790b7812e');
	}
})();