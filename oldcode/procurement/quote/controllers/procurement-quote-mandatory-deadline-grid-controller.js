(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.quote';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('procurementQuoteMandatoryDeadlineGridController', ProcurementQuoteMandatoryDeadlineGridController);

	ProcurementQuoteMandatoryDeadlineGridController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementQuoteMandatoryDeadlineGridController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '53f0117d8b7845f9940265c102734adc');
	}
})();