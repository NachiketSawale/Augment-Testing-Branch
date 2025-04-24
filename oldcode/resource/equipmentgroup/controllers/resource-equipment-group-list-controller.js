/**
 * Created by baf on 2017/08/23.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipmentgroup';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of resource type entities.
	 **/
	angModule.controller('resourceEquipmentGroupListController', ResourceEquipmentGroupListController);

	ResourceEquipmentGroupListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ec561557d8c14da28d7e98aa058acff9');
	}
})();