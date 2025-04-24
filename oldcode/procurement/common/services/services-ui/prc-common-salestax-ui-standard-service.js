/**
 * Created by lcn on 02/24/2022.
 */
(function () {
	'use strict';
	var moduleName = 'procurement.common';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('procurementCommonSalesTaxLayoutService',
		['_', 'basicsLookupdataConfigGenerator', 'procurementCommonSalesTaxCodeComplexService',
			function (_, basicsLookupdataConfigGenerator, salesTaxCodeComplexService) {
				return {
					fid: 'procurement.common.sales.tax.detail',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							gid: 'basicData',
							attributes: ['amount', 'amountoc', 'amountnet', 'amountnetoc', 'amounttax', 'amounttaxoc', 'taxpercentcalculation', 'code', 'description', 'mdcsalestaxcodes']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					translationInfos: {
						extraModules: [moduleName, cloudCommonModule],
						extraWords: {
							Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
							Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
							Amount: {location: cloudCommonModule, identifier: 'entityAmount', initial: 'Amount'},
							AmountOc: {location: cloudCommonModule, identifier: 'entityAmountOc', initial: 'Amount Oc'},
							AmountNet: {location: moduleName, identifier: 'paymentAmountNet', initial: 'Net Amount'},
							AmountNetOc: {location: moduleName, identifier: 'paymentAmountNetOc', initial: 'Net Amount Oc'},
							AmountTax: {location: moduleName, identifier: 'paymentAmountTax', initial: 'Amount Tax'},
							AmountTaxOc: {location: moduleName, identifier: 'paymentAmountTaxOc', initial: 'Amount Tax Oc'},
							TaxPercentCalculation: {location: cloudCommonModule, identifier: 'entityTaxPercent', initial: 'Tax Percent'},
							MdcSalesTaxCodes: {location: moduleName, identifier: 'TaxCodes', initial: 'Tax Codes'}
						}
					},
					overloads: {
						code: {readonly: true},
						description: {readonly: true},
						amount: {readonly: true, grid: {sortable: false}},
						amountoc: {readonly: true, grid: {sortable: false}},
						amountnet: {readonly: true, grid: {sortable: false}},
						amountnetoc: {readonly: true, grid: {sortable: false}},
						amounttax: {readonly: true, grid: {sortable: false}},
						amounttaxoc: {readonly: true, grid: {sortable: false}},
						taxpercentcalculation: {readonly: true, grid: {sortable: false}},
						mdcsalestaxcodes: {
							'grid': {
								isTransient: true,
								editor: 'directive',
								editorOptions: {
									showClearButton: true,
									directive: 'procurement-common-sales-tax-code-complex-lookup',
									grid: true
								},
								formatter: salesTaxCodeComplexService.displayFormatter
							},
							'detail': {
								type: 'directive',
								isTransient: true,
								directive: 'procurement-common-sales-tax-code-complex-lookup',
								options: {
									showClearButton: true
								},
								formatter: salesTaxCodeComplexService.displayFormatter
							}
						},
					}
				};
			}]);

	angular.module(moduleName).factory('procurementCommonSalesTaxUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonSalesTaxLayoutService', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				function get(moduleSubModule, typeName) {
					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: typeName,// typeName: 'SalesTaxCodeDto',
						moduleSubModule: moduleSubModule // moduleSubModule: 'Procurement.Common'
					});
					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}

					function UIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;
					return new UIStandardService(layout, domainSchema, translationService);
				}

				return {
					get: get
				};
			}
		]);

})();
