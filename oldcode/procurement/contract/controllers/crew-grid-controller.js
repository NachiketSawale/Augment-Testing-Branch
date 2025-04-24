/**
 * Created by jhe on 1/11/2019.
 */
(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.contract';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('procurementContractCrewGridController', procurementContractCrewGridController);

	procurementContractCrewGridController.$inject = ['$scope', '$timeout', 'platformContainerControllerService', 'procurementContractCrewDataService'];

	function procurementContractCrewGridController($scope, $timeout, platformContainerControllerService, dataService) {
		platformContainerControllerService.initController($scope, moduleName, '518782BB7E024921B68890D83332867A');

		dataService.registerFilters();

		$scope.$on('$destroy', function () {
			dataService.unRegisterFilters();
		});
	}
})();