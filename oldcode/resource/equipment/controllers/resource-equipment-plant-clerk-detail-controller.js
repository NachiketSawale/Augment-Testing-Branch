/**
 * Created by cakiral.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantComponentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant clerk entities.
	 **/
	angModule.controller('resourceEquipmentPlantClerkDetailController', ResourceEquipmentPlantClerkDetailController);

	ResourceEquipmentPlantClerkDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '51b816720cb411ec82a80242ac130003');
	}
})();