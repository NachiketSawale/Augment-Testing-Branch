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
	angModule.controller('resourceEquipmentPlantClerkListController', ResourceEquipmentPlantClerkListController);

	ResourceEquipmentPlantClerkListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '38f8b5920cb411ec82a80242ac130003');
	}
})();