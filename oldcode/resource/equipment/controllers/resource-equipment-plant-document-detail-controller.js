/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant document entities
	 **/
	angModule.controller('resourceEquipmentPlantDocumentDetailController', ResourceEquipmentPlantDocumentDetailController);

	ResourceEquipmentPlantDocumentDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b364e4d2d3e7438cacfb320e3c8e93d9');
	}
})();