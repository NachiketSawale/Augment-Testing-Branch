/**
 * Created by cakiral.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantCertificateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant certificate component entities.
	 **/
	angModule.controller('resourceEquipmentPlantCertificateDetailController', ResourceEquipmentPlantCertificateDetailController);

	ResourceEquipmentPlantCertificateDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantCertificateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c53907e3aa1c42c0b1222d233a63f825');
	}
})();



