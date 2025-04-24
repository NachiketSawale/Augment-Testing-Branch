(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceGeneralFormController',
		['$scope', 'procurementInvoiceDetailControllerService', 'procurementInvoiceGeneralDataService',
			'procurementInvoiceGeneralsValidationService', 'procurementInvoiceGeneralUIStandardService', 'platformTranslateService',

			function ($scope, detailControllerService, dataService, validationService, UIStandardService, platformTranslateService) {
				detailControllerService.initDetailController($scope, dataService, validationService, UIStandardService, platformTranslateService);

			}]);
})(angular);