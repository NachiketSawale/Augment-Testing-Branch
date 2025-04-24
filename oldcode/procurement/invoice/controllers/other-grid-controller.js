(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular ,_ */
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name procurementInvoiceOtherGridController
	 * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementInvoiceHeaderDataService, procurementInvoiceHeaderGridColumns,  invoiceHeaderElementValidationService
	 * @description controller for contract header
	 */
	angular.module('procurement.invoice').controller('procurementInvoiceOtherGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceOtherDataService',
			'procurementInvoiceOtherValidationService', 'procurementInvoiceOtherUIStandardService', 'basicsWorkflowSidebarRegisterService', '$injector',
			function ($scope, gridControllerService, dataService, validationService, gridColumns, basicsWorkflowSidebarRegisterService, $injector) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// To Register other EntityFacade For Invoice Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('ADA1A20FC71346AFBACA08A5F3DC4A72', 'procurement.invoice', false,
					function getSelectedModelId() {
						let invoiceOtherDataService = $injector.get('procurementInvoiceOtherDataService');
						let selOtherServicesEntity = invoiceOtherDataService.getSelected();
						if (selOtherServicesEntity) {
							return selOtherServicesEntity.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let invoiceOtherDataService = $injector.get('procurementInvoiceOtherDataService');
						let items = invoiceOtherDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (selOtherServicesEntity) {
							return selOtherServicesEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);
			}]
	);
})(angular);