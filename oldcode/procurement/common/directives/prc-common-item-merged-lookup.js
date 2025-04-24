/**
 * Created by chi on 8/14/2018.
 */
( function (angular, globals, _) {
	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	globals.lookups.prcItemMergedLookup = function prcItemMergedLookup() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcItemMergedLookup',
				valueMember: 'Id',
				displayMember: 'Itemno',
				width: 80,
				height: 200,
				// disableDataCaching: true,
				uuid: '4d8dcd9bdc1e4b7abd16c63cede309c1',
				columns: [
					{id: 'ItemNO', field: 'ItemNO', name: 'ItemNO', width: 100, name$tr$: 'procurement.common.prcItemItemNo'},
					{
						id: 'desc1',
						field: 'MaterialCode',
						name: 'MaterialCode',
						width: 150,
						name$tr$: 'procurement.common.materialCode',
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
						name$tr$: 'procurement.common.orderQuantity'
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
						name$tr$: 'procurement.common.price',
						searchable: false
					},
					{
						id: 'totalPrice',
						field: 'TotalPrice',
						name: 'totalPrice',
						width: 150,
						name$tr$: 'procurement.common.totalPrice',
						searchable: false
					}
				],
				pageOptions: {
					enabled: true
				},
				title: {name: '', name$tr$: ''},
				dataProcessor: {
					execute: function(dataList){
						return _.sortBy(dataList, 'ItemNO');
					}
				}
			}
		};
	};

	angular.module(moduleName).directive('procurementCommonItemMergedLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcItemMergedLookup().lookupOptions);
		}
	]);

})(angular, globals, _);