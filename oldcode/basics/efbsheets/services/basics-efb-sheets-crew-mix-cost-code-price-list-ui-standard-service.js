/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'basics.efbsheets';

	/**
	 * @ngdoc service
	 * @name basicsEfbsheetsCrewMixCostCodePriceListUIStandardService
	 * @function
	 *
	 * @description
	 * basicsEfbsheetsCrewMixCostCodePriceListUIStandardService
	 */
	angular.module(moduleName).factory('basicsEfbsheetsCrewMixCostCodePriceListUIStandardService',
		['platformUIStandardConfigService', 'basicsEfbsheetsTranslationService', 'platformSchemaService','platformUIStandardExtentService',
			function (platformUIStandardConfigService, basicsEfbsheetsTranslationService, platformSchemaService,platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let efbSheetsCrewMixPriceListLayout = {

					'fid': 'basics.efbsheets.crewmixcostcodepricelist.layout.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['costcodepriceverfk', 'rate', 'currencyfk']
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
							readonly : true,
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
							},
							'readonly' : 'true'
						},
						'rate' : { readonly : true}
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
								},
								readonly : true
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

				let efbSheetCrewMixCostCodePriceListDomainSchema = platformSchemaService.getSchemaFromCache({typeName: 'CostcodePriceListDto', moduleSubModule: 'Basics.CostCodes'});

				if (efbSheetCrewMixCostCodePriceListDomainSchema) {
					efbSheetCrewMixCostCodePriceListDomainSchema = efbSheetCrewMixCostCodePriceListDomainSchema.properties;
				}

				function EfbSheetUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				EfbSheetUIStandardService.prototype = Object.create(BaseService.prototype);
				EfbSheetUIStandardService.prototype.constructor = EfbSheetUIStandardService;

				let layout = efbSheetsCrewMixPriceListLayout;
				let service = new BaseService(layout, efbSheetCrewMixCostCodePriceListDomainSchema, basicsEfbsheetsTranslationService);
				platformUIStandardExtentService.extend(service, layout.addition, efbSheetCrewMixCostCodePriceListDomainSchema);
				return service;
			}
		]);
})(angular);