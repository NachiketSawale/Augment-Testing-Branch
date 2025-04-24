(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementInvoicePesFormController
	 * @require $scope
	 * @description controller for Invoice Pes form
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoicePesFormController',
		['$scope', 'procurementInvoiceDetailControllerService', 'procurementInvoicePESDataService',
			'procurementInvoicePESValidationService', 'procurementInvoicePESUIStandardService', 'platformTranslateService',
			'modelViewerStandardFilterService',

			function ($scope, detailControllerService, dataService, validationService, UIStandardService, platformTranslateService,
				modelViewerStandardFilterService) {
				detailControllerService.initDetailController($scope, dataService, validationService, UIStandardService, platformTranslateService);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());
			}]);
})(angular);