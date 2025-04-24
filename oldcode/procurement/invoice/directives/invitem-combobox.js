( function (angular, globals, _) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	globals.lookups.prcItemLookup = function prcItemLookup() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcItemLookup',
				valueMember: 'Id',
				displayMember: 'Itemno',
				width: 80,
				height: 200,
				// disableDataCaching: true,
				uuid: '9d0b6b9463e549f893ea58e8397668c2',
				columns: [
					{id: 'ItemNO', field: 'ItemNO', name: 'ItemNO', width: 100, name$tr$: 'procurement.invoice.contract.itemNO'},
					{
						id: 'desc1',
						field: 'MaterialCode',
						name: 'MaterialCode',
						width: 150,
						name$tr$: 'procurement.invoice.contract.material',
						searchable: false
					},
					{
						id: 'desc',
						field: 'PrcItemDescription',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'quantity',
						field: 'Quantity',
						name: 'quantity',
						width: 150,
						name$tr$: 'procurement.invoice.contract.orderQuantity'
					},
					{
						id: 'uom',
						field: 'Uom',
						name: 'uom',
						width: 150,
						name$tr$: 'cloud.common.entityUoM'
					},
					{
						id: 'priceValue',
						field: 'PriceValue',
						name: 'priceValue',
						width: 150,
						name$tr$: 'procurement.invoice.contract.price',
						searchable: false
					},
					{
						id: 'totalPrice',
						field: 'TotalPrice',
						name: 'totalPrice',
						width: 150,
						name$tr$: 'procurement.invoice.contract.totalPrice',
						searchable: false
					}
				],
				pageOptions: {
					enabled: true
				},
				title: {name: 'Contract Item', name$tr$: 'procurement.pes.entityPrcItemFk'},
				dataProcessor: {
					execute: function(dataList){
						return _.sortBy(dataList, 'ItemNO');
					}
				}
			}
		};
	};

	angular.module('procurement.invoice').directive('procurementInvoiceItemLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcItemLookup().lookupOptions/* , {
				processData: function (dataList) {  // list sort by 'ItemNO'
					return _.sortBy(dataList, 'ItemNO');
				}
			} */);
		}
	]);

})(angular, globals, _);