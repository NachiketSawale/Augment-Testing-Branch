/**
 * Created by joshi on 16.09.2014.
 */
(function () {

	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCostCodesUIConfigurationService is the config service for all costcodes views.
	 */
	angular.module(moduleName).factory('basicsCostCodesPriceVersionListRecordUIConfigurationService', [
		function () {

			return {
				getDetailLayout: function () {
					return {
						'fid': 'basics.costcodes.price.version.list.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['costcodepriceverfk', 'rate', 'salesprice', 'currencyfk', 'factorcost', 'realfactorcost', 'factorquantity', 'realfactorquantity', 'factorhour',  'co2source', 'co2sourcefk', 'co2project']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							costcodepriceverfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-cost-codes-price-version-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'CostCodePriceVersion',
										displayMember: 'DescriptionInfo.Translated'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-cost-codes-price-version-lookup',
									'options': {
										descriptionMember: 'DescriptionInfo.Translated'
									}
								}
							},
							'currencyfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-lookupdata-currency-combobox'
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'currency',
										'displayMember': 'Currency'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-currency-combobox',
									'options': {'showClearButton': true}
								}
							},
							'realfactorcost' : { readonly : true},
							'realfactorquantity' : { readonly : true},
							co2source:{
								readonly: true
							},
							co2sourcefk: {
								readonly: true,
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-source-name-lookup',
									'options': {
										version: 3
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'basics-lookupdata-source-name-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'co2sourcename',
										displayMember: 'DescriptionInfo.Translated',
										version: 3
									}
								}
							}
						},
						'addition': {
							grid: [
								{
									lookupDisplayColumn: true,
									field: 'CostcodePriceVerFk',
									name: 'Price List',
									name$tr$: 'basics.costcodes.priceList.priceListDescription',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'CostCodePriceVersion',
										displayMember: 'PriceListDescription'
									}
								}
							],
							detail: [
								{
									readonly: true,
									lookupDisplayColumn: true,
									model: 'CostcodePriceVerFk',
									label$tr$: 'basics.costcodes.priceList.priceListDescription',
									options: {
										displayMember: 'PriceListDescription'
									}
								}
							]
						}
					};
				}
			};
		}
	]);
})();