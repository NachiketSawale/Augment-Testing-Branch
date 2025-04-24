/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentProcurementContractsDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant procurement contracts entities
	 **/
	angModule.controller('resourceEquipmentProcurementContractsDetailController', ResourceEquipmentProcurementContractsDetailController);

	ResourceEquipmentProcurementContractsDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentProcurementContractsDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName,'d2015e219c124e6cbdb1134dffa062b2');
	}
})();