/**
 * Created by leo on 19.09.2017.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantAccessoryListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant entities.
	 **/
	angModule.controller('resourceEquipmentPlantAccessoryListController', ResourcePlantAccessoryListController);

	ResourcePlantAccessoryListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantAccessoryListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c8814c5d27b54f60827f48112dc1fc57');
	}
})();