/**
 * Created by chi on 5/26/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsMaterialPriceListLayout', basicsMaterialPriceListLayout);

	basicsMaterialPriceListLayout.$inject = ['basicsCommonRoundingService'];

	function basicsMaterialPriceListLayout(basicsCommonRoundingService){
		let layout= {
			fid: 'basics.material.price.list.detail',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['materialpriceversionfk', 'currencyfk', 'retailprice', 'listprice', 'discount', 'charges',
						'prcpriceconditionfk', 'priceextras', 'cost', 'estimateprice','dayworkrate', 'leadtime', 'taxcodefk', 'minquantity',
						'sellunit', 'source','co2source','basco2sourcefk','co2project','id']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			translationInfos: {
				'extraModules': [cloudCommonModule],
				'extraWords': {
					MaterialPriceVersionFk: {location: moduleName, identifier: 'priceList.materialPriceVersion', initial: 'Price Version'},
					CurrencyFk: {
						location: cloudCommonModule,
						identifier: 'entityCurrency',
						initial: 'Currency'
					},
					RetailPrice: {
						location: moduleName,
						identifier: 'record.retailPrice',
						initial: 'Retail Price'
					},
					ListPrice: {
						location: moduleName,
						identifier: 'record.listPrice',
						initial: 'List Price'
					},
					Discount: {location: moduleName, identifier: 'record.discount', initial: 'Discount'},
					Charges: {location: moduleName, identifier: 'record.charges', initial: 'Charges'},
					PrcPriceConditionFk: {
						location: cloudCommonModule,
						identifier: 'entityPriceCondition',
						initial: 'Price Condition'
					},
					PriceExtras: {
						location: moduleName,
						identifier: 'record.priceExtras',
						initial: 'Extras'
					},
					Cost: {
						location: moduleName,
						identifier: 'record.costPrice',
						initial: 'Cost Price'
					},
					EstimatePrice: {
						location: moduleName,
						identifier: 'record.estimatePrice',
						initial: 'Estimate Price'
					},
					DayworkRate: {
						location: moduleName,
						identifier: 'record.dayworkRate',
						initial: 'Daywork Rate'
					},
					LeadTime: {
						location: moduleName,
						identifier: 'materialSearchLookup.htmlTranslate.leadTimes',
						initial: 'Lead Time(Days)'
					},
					TaxCodeFk: {
						location: cloudCommonModule,
						identifier: 'entityTaxCode',
						initial: 'Tax Code'
					},
					MinQuantity: {
						location: moduleName,
						identifier: 'record.minQuantity',
						initial: 'Minimum Order Qty'
					},
					SellUnit: {
						location: moduleName,
						identifier: 'record.sellUnit',
						initial: 'Sell Unit'
					},
					Source:{
						location: moduleName,
						identifier: 'record.source',
						initial: 'Source'
					},
					Co2Source:{
						location: moduleName,
						identifier: 'record.entityCo2Source',
						initial: 'CO2/kg (Source)'
					},
					BasCo2SourceFk:{
						location: moduleName,
						identifier: 'record.entityBasCo2SourceFk',
						initial: 'CO2/kg (Source Name)'
					},
					Co2Project:{
						location: moduleName,
						identifier: 'record.entityCo2Project',
						initial: 'CO2/kg (Project)'
					},
					Id:{location: cloudCommonModule, identifier: 'entityId', initial: 'Id'}
				}
			},
			overloads: {
				'id':{readonly:true},
				'priceextras': {
					readonly: true
				},
				'cost': {
					readonly: true
				},
				'materialpriceversionfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-material-catalog-price-version-lookup',
						'options': {
							filterKey: 'basics-material-price-list-price-version-filter'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-material-catalog-price-version-lookup',
							lookupOptions: {
								filterKey: 'basics-material-price-list-price-version-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialPriceVersion',
							displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
						}
					}
				},
				'currencyfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-currency-combobox'
					},
					'grid': {
						readonly: false,
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'basics-lookupdata-currency-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'currency',
							displayMember: 'Currency'
						}
					}
				},
				'prcpriceconditionfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-Material-Price-Condition-Combobox',
						'options': {
							showClearButton: true,
							dataService: 'basicsMaterialPriceConditionDataServiceNew'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								dataService:'basicsMaterialPriceConditionDataServiceNew'
							},
							directive: 'basics-Material-Price-Condition-Combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcPricecondition',
							displayMember: 'DescriptionInfo.Translated'
						}
					}
				},
				'taxcodefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'basics-master-data-context-tax-code-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'basics-master-data-context-tax-code-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TaxCode',
							displayMember: 'Code'
						}
					}
				},
				co2source:{
					readonly: true
				},
				basco2sourcefk: {
					readonly: true,
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-source-name-lookup',
						'options': {
							version: 3,
							lookupOptions: {
								showClearButton: true
							}
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
				},
			},
			'addition': {
				'grid': [
					{
						'afterId': 'materialpriceversionfk',
						id: 'materialpriceversionPriceList',
						field: 'MaterialPriceVersionFk',
						name: 'Price List',
						name$tr$: 'basics.material.priceList.priceList',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialPriceVersion',
							displayMember: 'PriceListDescriptionInfo.Translated'
						},
						grouping: {
							'title': 'basics.material.priceList.priceList',
							'getter': 'MaterialPriceVersionFk',
							'aggregators': [],
							'aggregateCollapsed': true
						}
					},
					{
						lookupDisplayColumn: true,
						field: 'TaxCodeFk',
						name$tr$: 'cloud.common.entityTaxCodeDescription',
						displayMember: 'DescriptionInfo.Translated',
						width: 150
					},
					{
						formatter: 'money',
						field: 'CostPriceGross',
						name: 'Cost Price (Gross)',
						name$tr$: 'basics.material.record.costPriceGross',
						width: 150,
						editor: 'decimal',
						editorOptions: { decimalPlaces: 2 },
						formatterOptions: { decimalPlaces: 2 }
					}
				],
				'detail': [
					{
						'afterId': 'materialpriceversionfk',
						'rid': 'materialpriceversionPriceList',
						'gid': 'basicData',
						'label': 'Price List',
						'label$tr$': 'basics.material.priceList.priceList',
						'model': 'MaterialPriceVersionFk',
						'type': 'directive',
						'directive': 'basics-material-catalog-price-version-lookup',
						'options': {
							displayMember: 'PriceListDescriptionInfo.Translated',
							readOnly: true
						}
					},
					{
						afterId: 'estimateprice',
						rid: 'costPriceGross',
						gid: 'basicData',
						model: 'CostPriceGross',
						label: 'Cost Price (Gross)',
						label$tr$: 'basics.material.record.costPriceGross',
						type: 'decimal',
						readonly: false,
						options: {
							decimalPlaces: 2
						}
					}
				]
			}
		};

		basicsCommonRoundingService.getService('basics.material').uiRoundingConfig(layout);

		return layout;
	}

	angular.module(moduleName).factory('basicsMaterialPriceListUIStandardService', basicsMaterialPriceListUIStandardService);
	basicsMaterialPriceListUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'basicsMaterialPriceListLayout',
		'basicsMaterialTranslationService', 'platformUIStandardExtentService'];
	function basicsMaterialPriceListUIStandardService(platformUIStandardConfigService, platformSchemaService, basicsMaterialPriceListLayout,
		basicsMaterialTranslationService, platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({ typeName: 'MaterialPriceListDto', moduleSubModule: 'Basics.Material' }).properties;
		var service = new BaseService(basicsMaterialPriceListLayout, domains, basicsMaterialTranslationService);
		platformUIStandardExtentService.extend(service, basicsMaterialPriceListLayout.addition, domains);
		return service;
	}
})(angular);