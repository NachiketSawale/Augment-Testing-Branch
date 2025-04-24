/**
 * Created by baf on 2017/08/29.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipmentgroup';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of resource type entities
	 **/
	angModule.controller('resourceEquipmentGroupDetailController', ResourceEquipmentGroupDetailController);

	ResourceEquipmentGroupDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '855334f9234246f5840900e646fa0a1e');
	}
})();