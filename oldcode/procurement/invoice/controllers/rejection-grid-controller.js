(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular ,_ */
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name procurementInvoiceRejectionGridController
	 * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementInvoiceHeaderDataService, procurementInvoiceHeaderGridColumns,  invoiceHeaderElementValidationService
	 * @description controller for contract header
	 */
	angular.module('procurement.invoice').controller('procurementInvoiceRejectionGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceRejectionDataService',
			'procurementInvoiceRejectionValidationService', 'procurementInvoiceRejectionUIStandardService', 'basicsWorkflowSidebarRegisterService', '$injector',
			function ($scope, gridControllerService, dataService, validationService, gridColumns, basicsWorkflowSidebarRegisterService, $injector) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// To Register rejection EntityFacade For Invoice Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('1A37CE255FF64022A972C3DB61A48EE2', 'procurement.invoice', false,
					function getSelectedModelId() {
						let invoiceRejectionDataService = $injector.get('procurementInvoiceRejectionDataService');
						let rejectionEntity = invoiceRejectionDataService.getSelected();
						if (rejectionEntity) {
							return rejectionEntity.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let invoiceRejectionDataService = $injector.get('procurementInvoiceRejectionDataService');
						let items = invoiceRejectionDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (rejectionEntity) {
							return rejectionEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);
			}]
	);
})(angular);