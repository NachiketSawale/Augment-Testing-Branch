/**
 * Created by chk on 6/3/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).value('procurementInvoiceReconciliationGridColumn', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'invGeneralDescription',
						field: 'Remark',
						name: 'Remark',
						name$tr$: 'procurement.invoice.invContractItem.description',
						width: 120
					},
					{
						id: 'invValueType',
						field: 'ValueType',
						name: 'ValueType',
						name$tr$: 'procurement.invoice.invContractItem.valueType',
						width: 120
					},
					{
						id: 'invValue',
						field: 'InvoiceValue',
						name: 'InvoiceValue',
						name$tr$: 'procurement.invoice.invContractItem.invoiceValue',
						width: 120
					},
					{
						id: 'invContractValue',
						field: 'ContractValue',
						name: 'ContractValue',
						name$tr$: 'procurement.invoice.invContractItem.contractValue',
						width: 120
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('invoiceReconciliationWarnController', [
		'$scope', '$translate', 'basicsCommonDialogGridControllerService', 'procurementInvoiceReconciliationGridColumn',
		'invoiceReconciliationWarnService', 'platformGridAPI', 'procurementInvoiceValidationDataService',
		function ($scope, $translate, basicsCommonDialogGridControllerService, gridColumn,
			dataService, platformGridAPI, validationDataService) {

			$scope.modalTitle = $translate.instant('procurement.invoice.reconciliationDialogTitle');
			$scope.actionButtonText = $translate.instant('cloud.common.ok');
			$scope.WarningMessage = $translate.instant('procurement.invoice.reconciliationWarningMessage');
			$scope.onOK = function () {
				$scope.$close(false);
			};

			var gridConfig = {
				id: 'invoice-reconciliation-warn',
				initCalled: false,
				columns: [],
				uuid: '8B83B2C77EE548000EF5FC9560C1F816'
			};

			function init() {
				basicsCommonDialogGridControllerService.initListController($scope, gridColumn, dataService, null, gridConfig);

				var res = validationDataService.getItems();
				if (res && res.length) {
					dataService.setList(res);
					dataService.gridRefresh();
					platformGridAPI.grids.resize($scope.gridId);
					$scope.onContentResized();
				}
			}

			init();
		}
	]);
})(angular);