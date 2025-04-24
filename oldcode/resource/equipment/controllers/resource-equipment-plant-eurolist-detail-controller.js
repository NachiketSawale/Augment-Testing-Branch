/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantEurolistDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant eurolist entities
	 **/
	angModule.controller('resourceEquipmentPlantEurolistDetailController', ResourceEquipmentPlantEurolistDetailController);

	ResourceEquipmentPlantEurolistDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantEurolistDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2dd482ff9dd043209388b267dd278a83');
	}
})();