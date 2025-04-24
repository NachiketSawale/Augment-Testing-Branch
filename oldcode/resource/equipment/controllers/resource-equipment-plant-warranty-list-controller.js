/**
 * Created by baf on 15.07.2022
 */
(function (angular) {

	'use strict';
	const moduleName = 'resource.equipment';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantWarrantyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of assignment entities.
	 **/
	angModule.controller('resourceEquipmentPlantWarrantyListController', ResourceEquipmentPlantWarrantyListController);

	ResourceEquipmentPlantWarrantyListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantWarrantyListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9552282e659b480c8e3b3a2338861377');
	}
})(angular);