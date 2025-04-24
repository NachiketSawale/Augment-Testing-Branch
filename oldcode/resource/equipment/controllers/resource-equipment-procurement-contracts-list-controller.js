/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentProcurementContractsListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant component entities.
	 **/
	angModule.controller('resourceEquipmentProcurementContractsListController', ResourceEquipmentProcurementContractsListController);

	ResourceEquipmentProcurementContractsListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentProcurementContractsListController($scope, platformContainerControllerService) { platformContainerControllerService.initController($scope, moduleName, '213a828ef4e94991a8210e161fc17cba'); }
})();