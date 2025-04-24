(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractCallOffAgreementGridController', ProcurementContractCallOffAgreementGridController);

	ProcurementContractCallOffAgreementGridController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementContractCallOffAgreementGridController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '16d4b43815ce46bfb37189ec58d973bb');
	}
})(angular);