/**
 * Created by baf on 2017/08/29.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant entities
	 **/
	angModule.controller('resourceEquipmentPlantDetailController', ResourceEquipmentPlantDetailController);

	ResourceEquipmentPlantDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '14744d2f5e004676abfefd1329b6beff');
	}
})();