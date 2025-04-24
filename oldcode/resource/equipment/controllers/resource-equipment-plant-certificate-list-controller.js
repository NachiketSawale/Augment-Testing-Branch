/**
 * Created by cakiral.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantCertificateListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant certification component entities.
	 **/
	angModule.controller('resourceEquipmentPlantCertificateListController', ResourceEquipmentPlantCertificateListController);

	ResourceEquipmentPlantCertificateListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantCertificateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6182b7c0ed6e498492dbe88e061f3457');
	}
})();