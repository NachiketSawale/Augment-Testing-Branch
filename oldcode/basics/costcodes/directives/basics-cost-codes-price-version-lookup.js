/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	angular.module(moduleName).directive('basicsCostCodesPriceVersionLookup',
		['_','BasicsLookupdataLookupDirectiveDefinition',
			function (_,BasicsLookupdataLookupDirectiveDefinition) {
				let defaults = {
					lookupType: 'CostCodePriceVersion',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					uuid: '4E398F47B18D4966BD79346215781E8A',
					columns: [
						{
							id: 'priceverdesc',
							field: 'DescriptionInfo.Translated',
							name: 'Price Version Description',
							name$tr$: 'basics.costcodes.priceList.priceVersionDescription',
							width: 100
						},
						{
							id: 'pricelistfk',
							field: 'PriceListFk',
							name: 'Price List Description',
							name$tr$: 'basics.costcodes.priceList.priceListDescription',
							formatter: 'lookup',
							formatterOptions: {
								'lookupSimpleLookup': true,
								'lookupModuleQualifier': 'basics.customize.pricelist',
								'displayMember': 'Description',
								'valueMember': 'Id'
							}
						}
					],
					title: {
						name: 'Price Versions',
						name$tr$: 'basics.costcodes.priceVerion.grid.title'
					},
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						let searchString = '(DescriptionInfo.Description.Contains("%SEARCH%"))';
						return searchString.replace(/%SEARCH%/g, searchValue);
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
					processData: function (itemList, options) {
						if (angular.isArray(options.additionalData) && options.additionalData.length > 0 && itemList && itemList.length > 0) {
							_.forEach(options.additionalData, function (item) {
								let found = _.find(itemList, {Id: item.Id});
								if (!found) {
									itemList.unshift(item);
								}
							});
						}
						return itemList;
					}
				});
			}
		]);
})(angular);