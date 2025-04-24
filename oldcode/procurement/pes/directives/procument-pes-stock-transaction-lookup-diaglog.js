/**
 * Created by lcn on 9/14/2017.
 */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pes';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcStockTransaction = function prcStockTransaction() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcStocktransaction',
				valueMember: 'Id',
				displayMember: 'MaterialDescription',
				dialogOptions: {
					width: '680px'
				},
				uuid: 'd5aaf97f50e24a83831b8c3d07d15fb9',
				columns: [
					{
						id: 'id',
						field: 'Id',
						name: 'Id',
						width: 100
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Material Code',
						width: 100,
						name$tr$: 'basics.common.entityMaterialCode'
					},
					{
						id: 'desc',
						field: 'Description1',
						name: 'Material Description',
						width: 100,
						name$tr$: 'basics.common.entityMaterialDescription'
					},
					{
						id: 'transactiondate',
						field: 'TransactionDate',
						name: 'Transaction Date',
						width: 150,
						name$tr$: 'procurement.stock.transaction.TransactionDate',
						formatter: 'dateutc'
					},
					{
						id: 'quantity',
						field: 'Quantity',
						name: 'Quantity',
						width: 150,
						formatter: 'quantity',
						name$tr$: 'procurement.stock.transaction.Quantity'
					},
					{
						id: 'total',
						field: 'Total',
						name: 'Total',
						width: 150,
						formatter: 'money',
						name$tr$: 'procurement.stock.transaction.Total'
					},
					{
						id: 'provisionpercent',
						field: 'ProvisionPercent',
						name: 'Provision Percent',
						width: 150,
						formatter: 'money',
						name$tr$: 'procurement.stock.transaction.ProvisionPercent'
					},
					{
						id: 'provisiontotal',
						field: 'ProvisionTotal',
						name: 'Provision Total',
						width: 150,
						formatter: 'money',
						name$tr$: 'procurement.stock.transaction.ProvisionTotal'
					}
				],
				title: {
					name: 'procurement.pes.stockTransactionTitle'
				}
			}
		};
	};

	angular.module(moduleName).directive('procumentPesStockTransactionLookupDiaglog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcStockTransaction().lookupOptions);
		}]);

})(angular, globals);

