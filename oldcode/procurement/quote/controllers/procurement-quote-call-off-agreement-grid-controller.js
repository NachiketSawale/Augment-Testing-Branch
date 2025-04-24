(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular */

	'use strict';
	var moduleName = 'procurement.quote';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('procurementQuoteCallOffAgreementGridController', ProcurementQuoteCallOffAgreementGridController);

	ProcurementQuoteCallOffAgreementGridController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementQuoteCallOffAgreementGridController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7d9056a624544d0582486f46413e950c');
	}
})();