/**
 * Created by wuj on 6/1/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular ,_ */
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module('procurement.invoice').controller('procurementInvoiceGeneralGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceGeneralDataService',
			'procurementInvoiceGeneralsValidationService', 'procurementInvoiceGeneralUIStandardService', 'basicsWorkflowSidebarRegisterService', '$injector',
			function ($scope, gridControllerService, dataService, validationService, gridColumns, basicsWorkflowSidebarRegisterService, $injector) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// To Register General EntityFacade For Invoice Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('26F641836F9047B4BFFC876B60D265A4', 'procurement.invoice', false,
					function getSelectedModelId() {
						let invoiceGeneralDataService = $injector.get('procurementInvoiceGeneralDataService');
						let selGeneralEntity = invoiceGeneralDataService.getSelected();
						if (selGeneralEntity) {
							return selGeneralEntity.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let invoiceGeneralDataService = $injector.get('procurementInvoiceGeneralDataService');
						let items = invoiceGeneralDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (generalEntity) {
							return generalEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

			}]
	);
})(angular);