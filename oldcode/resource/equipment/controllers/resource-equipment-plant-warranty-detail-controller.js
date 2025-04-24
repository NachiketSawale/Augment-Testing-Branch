/**
 * Created by baf on 15.07.2022
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.equipment';
	const angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantWarrantyDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant assignment entities
	 **/
	angModule.controller('resourceEquipmentPlantWarrantyDetailController', ResourceEquipmentPlantWarrantyDetailController);

	ResourceEquipmentPlantWarrantyDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantWarrantyDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6e2f6cdff8244bc5a7bda75cc1983b35');
	}
})(angular);