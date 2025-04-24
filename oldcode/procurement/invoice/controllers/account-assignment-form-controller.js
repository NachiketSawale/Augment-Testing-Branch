/**
 * Created by jhe on 8/29/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementInvoiceAccountAssignmentFormController', ProcurementInvoiceAccountAssignmentFormController);

	ProcurementInvoiceAccountAssignmentFormController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementInvoiceAccountAssignmentFormController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1EB6D69BB01847C2B6FFC59254E2F3C1');
	}

	angular.module(moduleName).controller('procurementInvoiceAccountAssignmentFormController',
		['$scope', 'procurementInvoiceAccountAssignmentGetDataService', 'procurementInvoiceDetailControllerService',
			'procurementInvoiceAccountAssignmentGetValidationService', 'procurementInvoiceAccountAssignmentUIStandardService',
			'platformTranslateService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);
			}
		]);

})(angular);