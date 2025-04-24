(function (angular) {

	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteMandatoryDeadlineFormController', ProcurementQuoteMandatoryDeadlineFormController);

	ProcurementQuoteMandatoryDeadlineFormController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementQuoteMandatoryDeadlineFormController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '93089707dd9d4797b06224ce1940bfde', 'procurementQuoteTranslationService');
	}

})(angular);