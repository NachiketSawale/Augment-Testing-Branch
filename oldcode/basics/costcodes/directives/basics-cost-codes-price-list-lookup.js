/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	angular.module(moduleName).directive('basicsCostCodesPriceListLookup',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				let defaults = {
					lookupType: 'CostCodesPriceList',
					valueMember: 'Id',
					displayMember: 'Rate',
					uuid: 'a43e18302cee47509027ac8b780326b4',
					columns: [
						{
							id: 'rate',
							field: 'Rate',
							name: 'Market Rate',
							name$tr$: 'basics.costcodes.priceList.rate',
							formatter: 'money',
							width: 50
						},
						{
							id: 'salesprice',
							field: 'SalesPrice',
							name: 'Sales Price',
							name$tr$: 'basics.costcodes.priceList.salesPrice',
							formatter: 'money',
							width: 50
						},
						{
							id: 'CurrencyFk',
							field: 'CurrencyFk',
							name: 'Currency',
							width: 80,
							name$tr$: 'cloud.common.entityCurrency',
							searchable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'currency',
								displayMember: 'Currency'
							}
						}
					],
					title: {
						name: 'Price List',
						name$tr$: 'basics.costcodes.priceList.grid.title'
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
			}
		]);
})(angular);