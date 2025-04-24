(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name procurementInvoiceCertificateGridController
	 * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementInvoiceHeaderDataService, procurementInvoiceHeaderGridColumns,  invoiceHeaderElementValidationService
	 * @description controller for contract header
	 */
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.invoice').controller('procurementInvoiceCertificateGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceCertificateDataService',
			'procurementInvoiceCertificateValidationService', 'procurementInvoiceCertificateUIStandardService', 'procurementContextService',
			function ($scope, gridControllerService, dataService, validationService, gridColumns, moduleContext) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.addTools([
					{
						id: 'refresh',
						caption: 'cloud.desktop.navBarRefreshDesc',
						type: 'item',
						iconClass: 'tlb-icons ico-refresh',
						fn:dataService.refreshItem,
						disabled: function(){
							return moduleContext.isReadOnly;
						},
						permission: '#r'
					}
				]);

				_.remove($scope.tools.items, function (item) {
					return item.id === 'create';
				});
			}]
	);
})(angular);