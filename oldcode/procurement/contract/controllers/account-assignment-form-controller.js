/**
 * Created by jhe on 8/8/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractAccountAssignmentFormController', ProcurementContractAccountAssignmentFormController);

	ProcurementContractAccountAssignmentFormController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementContractAccountAssignmentFormController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '41536BFCB3804F9DB46E1373AF41F561');
	}

})(angular);