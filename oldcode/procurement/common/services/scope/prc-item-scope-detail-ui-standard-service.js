/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeDetailLayout',[
		'basicsMaterialScopeServiceFactory',
		'prcItemScopeDetailPriceConditionDataService',
		'procurementCommonServiceCache',
		function (basicsMaterialScopeServiceFactory,
			prcItemScopeDetailPriceConditionDataService,
			procurementCommonServiceCache) {
			function constructor() {
				var priceConditionService = prcItemScopeDetailPriceConditionDataService.getService();
				var layout = basicsMaterialScopeServiceFactory.createScopeDetailLayout(priceConditionService);
				//
				// layout.overloads.mdcmaterialfk = {
				//     navigator: {
				//         moduleName: 'basics.material'
				//     },
				//     'detail': {
				//         'type': 'directive',
				//         'directive': 'basics-material-material-lookup',
				//         'options': {
				//             filterKey: 'procurement-common-item-mdcmaterial-filter',
				//             showClearButton: true
				//         }
				//     },
				//     'grid': {
				//         formatter: 'lookup',
				//         formatterOptions: {
				//             lookupType: 'MaterialCommodity',
				//             displayMember: 'Code'
				//         },
				//         editor: 'lookup',
				//         editorOptions: {
				//             lookupOptions: {
				//                 filterKey: 'procurement-common-item-mdcmaterial-filter',
				//                 showClearButton: true
				//             },
				//             directive: 'basics-material-material-lookup'
				//         },
				//         width: 100
				//     }
				// };

				layout.groups[0].attributes = layout.groups[0].attributes.concat(['priceoc', 'priceextraoc', 'totalcurrency', 'totalquantity']);

				layout.overloads.totalquantity ={
					readonly: true
				};

				return layout;
			}

			return procurementCommonServiceCache.registerService(constructor, 'prcItemScopeDetailLayout');
		}
	]);

	angular.module(moduleName).factory('prcItemScopeDetailUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementCommonTranslationService', 'prcItemScopeDetailLayout', 'procurementCommonServiceCache', 'platformUIStandardExtentService', 'basicsCommonRoundingService',

			function (platformUIStandardConfigService, platformSchemaService, procurementCommonTranslationService, prcItemScopeDetailLayout, procurementCommonServiceCache, platformUIStandardExtentService, roundingService) {

				function constructor() {
					let BaseService = platformUIStandardConfigService;
					let basRoundingDataService = roundingService.getService('basics.material');

					var layout = prcItemScopeDetailLayout.getService();

					var domains = platformSchemaService.getSchemaFromCache({ typeName: 'PrcItemScopeDetailDto', moduleSubModule: 'Procurement.Common'}).properties;

					domains = angular.copy(domains);

					basRoundingDataService.uiRoundingConfig(layout);
					let decimalPlaces = basRoundingDataService.getDecimalPlaces('TotalQuantity');
					domains.TotalQuantity = {
						domain: 'quantity',
						detail: { options: {decimalPlaces: decimalPlaces} },
						grid: { editorOptions: {decimalPlaces: decimalPlaces},
							formatterOptions: {decimalPlaces: decimalPlaces}
						}
					};

					var service = new BaseService(layout, domains, procurementCommonTranslationService);

					platformUIStandardExtentService.extend(service, layout.addition, domains);

					return service;
				}

				return procurementCommonServiceCache.registerService(constructor, 'prcItemScopeDetailUIStandardService');
			}
		]);
})(angular);