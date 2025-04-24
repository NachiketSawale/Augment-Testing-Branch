/**
 * Created by lw on 11/10/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	var cloudCommonModule = 'cloud.common';
	var projectModule = 'project.stock';

	angular.module(moduleName).factory('basicsMaterialPriceVersionToStockListLayout', basicsMaterialPriceVersionToStockListLayout);
	basicsMaterialPriceVersionToStockListLayout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'platformContextService'];
	function basicsMaterialPriceVersionToStockListLayout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
		var filter = [{
			key: 'material-price-version-to-stock-list-prjstock-filter',
			serverSide: true,
			fn: function (currentItem) {
				if (currentItem.PrjStockFk) {
					return {PrjStockFk: currentItem.PrjStockFk};
				} else {
					return {};
				}
			}
		}
		];
		basicsLookupdataLookupFilterService.registerFilter(filter);
		return {
			fid: 'basics.material.price.version.to.stock.list',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['prjstockfk', 'mdcmatpriceverfk', 'validfrom']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			translationInfos: {
				'extraModules': [cloudCommonModule, projectModule],
				'extraWords': {
					PrjStockFk: {location: moduleName, identifier: 'entityStock', initial: 'Stock'},
					MdcMatPriceverFk: {location: moduleName, identifier: 'priceList.materialPriceVersion', initial: 'Price Version'},
					ValidFrom: {location: moduleName, identifier: 'validFrom', initial: 'Valid From'}
				}
			},
			overloads: {
				'prjstockfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectStockLookupDataService',
					enableCache: true,
					filter: function (item) {
						var prj = {PKey1: null, PKey2: null, PKey3: null};
						if (!item.ProjectFk) {
							prj.PKey3 = 0;
						} else {
							prj.PKey3 = item.ProjectFk;
						}
						return prj;
					}
				}, {required: true}),
				'mdcmatpriceverfk': {
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-material-catalog-price-version-lookup',
							lookupOptions: {
								filterKey: 'basics-material-price-version-to-stock-list-price-version-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialPriceVersion',
							displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
						}
					}
				},
				'validfrom': {
					'grid':{
						editor: 'dateutc',
						formatter: 'dateutc'
					}
				}
			}
		};
	}

	angular.module(moduleName).factory('basicsMaterialPriceVersionToStockListUIStandardService', basicsMaterialPriceVersionToStockListUIStandardService);
	basicsMaterialPriceVersionToStockListUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'basicsMaterialPriceVersionToStockListLayout',
		'basicsMaterialTranslationService', 'platformUIStandardExtentService'];
	function basicsMaterialPriceVersionToStockListUIStandardService(platformUIStandardConfigService, platformSchemaService, basicsMaterialPriceVersionToStockListLayout,
		basicsMaterialTranslationService, platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({
			typeName: 'Stock2matPriceverDto',
			moduleSubModule: 'Basics.Material'
		}).properties;
		var service = new BaseService(basicsMaterialPriceVersionToStockListLayout, domains, basicsMaterialTranslationService);
		platformUIStandardExtentService.extend(service, basicsMaterialPriceVersionToStockListLayout.addition, domains);
		return service;
	}
})(angular);
