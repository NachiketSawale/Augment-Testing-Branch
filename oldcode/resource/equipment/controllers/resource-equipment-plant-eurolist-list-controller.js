/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantEurolistListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of eurolist entities.
	 **/
	angModule.controller('resourceEquipmentPlantEurolistListController', ResourceEquipmentPlantEurolistListController);

	ResourceEquipmentPlantEurolistListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantEurolistListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c779f23a59854b0c9c9960044319d8a4');
	}
})();