/**
 * Created by henkel.
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
	 * Controller for the  list view of plant component entities.
	 **/
	angModule.controller('resourceEquipmentPlantComponentListController', ResourceEquipmentPlantComponentListController);

	ResourceEquipmentPlantComponentListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantComponentListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9f4ef6e2ff6d403fbb24f760c0c5fb70');
	}
})();