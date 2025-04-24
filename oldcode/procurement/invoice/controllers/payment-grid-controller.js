/**
 * Created by ltn on 11/18/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular ,_ */
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
     * @ngdoc controller
     * @name procurement.contract.procurementContractHeaderGridController
     * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementInvoiceHeaderDataService, procurementInvoiceHeaderGridColumns,  invoiceHeaderElementValidationService
     * @description controller for contract header
     */
	angular.module('procurement.invoice').controller('procurementInvoicePaymentGridController',
		['$scope', 'platformGridControllerService', 'procurementInvoicePaymentDataService',
			'procurementInvoicePaymentValidationService', 'procurementInvoicePaymentUIStandardService', 'basicsWorkflowSidebarRegisterService', '$injector',
			function ($scope, gridControllerService, dataService, validationService, gridColumns, basicsWorkflowSidebarRegisterService, $injector) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// To Register payment EntityFacade For Invoice Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('3AF2F620E2594D3887BC7D583DC5BECA', 'procurement.invoice', false,
					function getSelectedModelId() {
						let invoicePaymentDataService = $injector.get('procurementInvoicePaymentDataService');
						let selPaymentEntity = invoicePaymentDataService.getSelected();
						if (selPaymentEntity) {
							return selPaymentEntity.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let invoicePaymentDataService = $injector.get('procurementInvoicePaymentDataService');
						let items = invoicePaymentDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (selPaymentEntity) {
							return selPaymentEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);
			}]
	);
})(angular);
