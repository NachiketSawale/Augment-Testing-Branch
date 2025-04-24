/**
 * Created by jhe on 1/11/2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractCrewFormController', ProcurementContractCrewFormController);

	ProcurementContractCrewFormController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementContractCrewFormController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'CD70F3E8A849453DBCCE28E511B9BEA6');
	}

})(angular);