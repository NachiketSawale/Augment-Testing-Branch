/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeLayout',['basicsMaterialScopeServiceFactory', 'procurementCommonServiceCache', 'basicsLookupdataLookupFilterService', 'procurementContextService',
		function (basicsMaterialScopeServiceFactory, procurementCommonServiceCache, basicsLookupdataLookupFilterService, procurementContextService) {
			function constructor() {
				var layout = basicsMaterialScopeServiceFactory.createScopeLayout({
					fid: 'prc.item.scope'
				});

				var filters = [
					{
						key: 'material-scope-filter',
						serverSide: true,
						fn: function () {
							var prcItemService = procurementContextService.getItemDataService();
							var parent = prcItemService.getSelected();

							if(_.isNil(parent)){
								return '1==0';
							}

							return 'MaterialFk=' + parent.MdcMaterialFk + ' and IsLive=true';
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				// basics data group
				layout.groups[0].attributes.push('price');
				layout.groups[0].attributes.push('priceextra');
				layout.groups[0].attributes.push('total');
				layout.groups[0].attributes.push('priceoc');
				layout.groups[0].attributes.push('priceextraoc');
				layout.groups[0].attributes.push('totalcurrency');


				layout.overloads.matscope = {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-material-scope-lookup',
							'lookupOptions': {
								'showClearButton': true,
								'filterKey': 'material-scope-filter'
							}
						},
						'width': 125
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-material-scope-lookup',
						'options': {
							'showClearButton': true,
							'filterKey': 'material-scope-filter'
						}
					}
				};

				return layout;
			}

			return procurementCommonServiceCache.registerService(constructor, 'prcItemScopeLayout');
		}
	]);

	angular.module(moduleName).factory('prcItemScopeUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementCommonTranslationService', 'prcItemScopeLayout', 'procurementCommonServiceCache', 'basicsCommonRoundingService',

			function (platformUIStandardConfigService, platformSchemaService, procurementCommonTranslationService, prcItemScopeLayout, procurementCommonServiceCache, basicsCommonRoundingService) {
				function constructor(dataService) {
					var BaseService = platformUIStandardConfigService;

					var layout = prcItemScopeLayout.getService(dataService);

					var domains = platformSchemaService.getSchemaFromCache({
						typeName: 'MaterialScopeDto',
						moduleSubModule: 'Basics.Material'
					}).properties;

					domains = angular.copy(domains);

					domains.Price = {
						domain: 'money'
					};
					domains.PriceOc = {
						domain: 'money'
					};
					domains.PriceExtra = {
						domain: 'money'
					};
					domains.PriceExtraOc = {
						domain: 'money'
					};
					domains.Total = {
						domain: 'money'
					};
					domains.TotalCurrency = {
						domain: 'money'
					};

					layout.overloads.price = {
						readonly: true
					};
					layout.overloads.priceoc = {
						readonly: true
					};
					layout.overloads.priceextra = {
						readonly: true
					};
					layout.overloads.priceextraoc = {
						readonly: true
					};
					layout.overloads.total = {
						readonly: true
					};
					layout.overloads.totalcurrency = {
						readonly: true
					};

					basicsCommonRoundingService.getService('basics.material').uiRoundingConfig(layout);

					return new BaseService(layout, domains, procurementCommonTranslationService);
				}

				return procurementCommonServiceCache.registerService(constructor, 'prcItemScopeUIStandardService');
			}
		]);
})(angular);
