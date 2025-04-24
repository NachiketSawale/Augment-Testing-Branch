/**
 * Created by henkel.
 */
(function () {

	'use strict';
	const moduleName = 'resource.equipmentgroup';
	const angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant document entities
	 **/
	angModule.controller('resourceEquipmentGroupDocumentDetailController', ResourceEquipmentGroupDocumentDetailController);

	ResourceEquipmentGroupDocumentDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentGroupDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f81af0c472c240b6aaec7741cb08a266');
	}
})();