/**
 * Created by cakiral on 2020/04/07.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantComponentMaintSchemaListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant entities.
	 **/
	angModule.controller('resourceEquipmentPlantComponentMaintSchemaListController', ResourceEquipmentPlantComponentMaintSchemaListController);

	ResourceEquipmentPlantComponentMaintSchemaListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantComponentMaintSchemaListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'adacb904781511eabc550242ac130003');
	}
})();