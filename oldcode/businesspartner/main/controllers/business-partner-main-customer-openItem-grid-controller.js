(function () {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainCustomerOpenItemListController',
		['$scope', '$http', '$timeout', '$translate', '_','platformModalService',
			'PlatformMessenger', 'platformGridAPI',
			'businesspartnerCustomerOpenItemService', 'platformGridControllerService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $http, $timeout, $translate,_,platformModalService, PlatformMessenger, platformGridAPI, businesspartnerCustomerOpenItemService, platformGridControllerService) {
				const columns = [
					{
						id: 'customerNo',
						field: 'Customer_No',
						name: 'Customer No.',
						name$tr$: 'businesspartner.main.openItem.customerNo',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'amount',
						field: 'Amount',
						name: 'Amount',
						name$tr$: 'businesspartner.main.openItem.amount',
						width: 120,
						formatter: 'money',
						readonly: true
					},
					{
						id: 'amountLCY',
						field: 'Amount_LCY',
						name: 'Amount LCY',
						name$tr$: 'businesspartner.main.openItem.amountLCY',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'auxiliaryIndex1',
						field: 'AuxiliaryIndex1',
						name: 'Auxiliary Index1',
						name$tr$: 'businesspartner.main.openItem.auxiliaryIndex1',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'creditAmount',
						field: 'Credit_Amount',
						name: 'Credit Amount',
						name$tr$: 'businesspartner.main.openItem.creditAmount',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'creditAmountLCY',
						field: 'Credit_Amount_LCY',
						name: 'Credit Amount LCY',
						name$tr$: 'businesspartner.main.openItem.creditAmountLCY',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'currencyCode',
						field: 'Currency_Code',
						name: 'Currency Code',
						name$tr$: 'businesspartner.main.openItem.currencyCode',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'V',
						field: 'Customer_Name',
						name: 'Customer Name',
						name$tr$: 'businesspartner.main.openItem.customerName',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'debitAmount',
						field: 'Debit_Amount',
						name: 'Debit Amount',
						name$tr$: 'businesspartner.main.openItem.debitAmount',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'debitAmountLCY',
						field: 'Debit_Amount_LCY',
						name: 'Debit Amount LCY',
						name$tr$: 'businesspartner.main.openItem.debitAmountLCY',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'dimensionSetID',
						field: 'Dimension_Set_ID',
						name: 'Dimension Set ID',
						name$tr$: 'businesspartner.main.openItem.dimensionSetID',
						formatter: 'description'
					},
					{
						id: 'documentDate',
						field: 'Document_Date',
						name: 'Document Date',
						name$tr$: 'businesspartner.main.openItem.documentDate',
						formatter: 'datetime',
						readonly: true
					},
					{
						id: 'documentNo',
						field: 'Document_No',
						name: 'Document No.',
						name$tr$: 'businesspartner.main.openItem.documentNo',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'documentType',
						field: 'Document_Type',
						name: 'Document Type',
						name$tr$: 'businesspartner.main.openItem.documentType',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'dueDate',
						field: 'Due_Date',
						name: 'Due Date',
						name$tr$: 'businesspartner.main.openItem.dueDate',
						formatter: 'datetime',
						readonly: true
					},
					{
						id: 'ICPartnerCode',
						field: 'IC_Partner_Code',
						name: 'IC Partner Code',
						name$tr$: 'businesspartner.main.openItem.ICPartnerCode',
						formatter: 'code',
						readonly: true
					},
					{
						id: 'open',
						field: 'Open',
						name: 'Open',
						name$tr$: 'businesspartner.main.openItem.open',
						formatter: 'boolean',
						readonly: true
					},
					{
						id: 'originalAmtLCY',
						field: 'Original_Amt_LCY',
						name: 'Original Amount LCY',
						name$tr$: 'businesspartner.main.openItem.originalAmtLCY',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'pmtDiscountDate',
						field: 'Pmt_Discount_Date',
						name: 'Pmt Discount Date',
						name$tr$: 'businesspartner.main.openItem.pmtDiscountDate',
						formatter: 'datetime',
						readonly: true
					},
					{
						id: 'postingDate',
						field: 'Posting_Date',
						name: 'Posting Date',
						name$tr$: 'businesspartner.main.openItem.postingDate',
						formatter: 'datetime',
						readonly: true
					},
					{
						id: 'reasonCode',
						field: 'Reason_Code',
						name: 'Reason Code',
						name$tr$: 'businesspartner.main.openItem.reasonCode',
						formatter: 'code',
						readonly: true
					},
					{
						id: 'remainingAmount',
						field: 'Remaining_Amount',
						name: 'Remaining Amount',
						name$tr$: 'businesspartner.main.openItem.remainingAmount',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'remainingAmountLcy',
						field: 'Remaining_Amt_LCY',
						name: 'Remaining Amount LCY',
						name$tr$: 'businesspartner.main.openItem.remainingAmountLcy',
						formatter: 'money',
						readonly: true
					},
					{
						id: 'salespersonCode',
						field: 'Salesperson_Code',
						name: 'Sales Person Code',
						name$tr$: 'businesspartner.main.openItem.salespersonCode',
						formatter: 'code',
						readonly: true
					},
					{
						id: 'sourceCode',
						field: 'Source_Code',
						name: 'Source Code',
						name$tr$: 'businesspartner.main.openItem.sourceCode',
						formatter: 'code',
						readonly: true
					},
					{
						id: 'transactionNO',
						field: 'Transaction_No',
						name: 'Transaction NO.',
						name$tr$: 'businesspartner.main.openItem.transactionNO',
						formatter: 'integer',
						readonly: true
					},
				];

				columns.forEach(function (column) {
					column.sortable = true;
					column.grouping = {
						title: column.name,
						getter: column.field,
						aggregators: [],
						aggregateCollapsed: true
					};
				});

				const columnDef = {
					getStandardConfigForListView: function () {
						return {
							columns: columns
						};
					}
				};
				const uuid = $scope.getContentValue('uuid');
				const gridConfig = {
					initCalled: false,
					columns: [],
					grouping: true,
					uuid: uuid
				};

				platformGridControllerService.initListController($scope, columnDef, businesspartnerCustomerOpenItemService, null, gridConfig);
				$scope.tools.items = _.filter($scope.tools.items,function (item) {
					return  item.id !== 'create' && item.id !== 'delete';
				});
				$scope.setTools = function (tools) {
					$scope.tools.items = _.filter(tools.items,function (item) {
						return  item.id !== 'create' && item.id !== 'delete';
					});
					tools.update = function () {
						tools.version += 1;
					};
					$scope.tools.update();
				};

				$scope.tools.update();

				// un-register on destroy
				$scope.$on('$destroy', function () {
				});
			}
		]);
})();