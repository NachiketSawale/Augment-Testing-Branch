(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.contract';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('procurementContractMandatoryDeadlineGridController', ProcurementContractMandatoryDeadlineGridController);

	ProcurementContractMandatoryDeadlineGridController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementContractMandatoryDeadlineGridController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bf1dc8854bd945928f5f890af558a5e5');
	}
})();