(function (angular) {

	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteCallOffAgreementFormController', ProcurementQuoteCallOffAgreementFormController);

	ProcurementQuoteCallOffAgreementFormController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementQuoteCallOffAgreementFormController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '43c07f06ee0b40818f217bedeb9928df', 'procurementQuoteTranslationService');
	}

})(angular);