
(function (angular) {
	'use strict';
	/*global _*/

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'productionplanningProcessConfigurationTranslationService',
		'platformSchemaService',
		'basicsLookupdataConfigGenerator',
		'platformRuntimeDataService',
		'ppsPhaseProductionPlaceFilterService',
		'basicsLookupdataLookupFilterService'];

	function UIStandardService(platformUIStandardConfigService,
		translationService,
		platformSchemaService,
		basicsLookupdataConfigGenerator,
		platformRuntimeDataService,
		ppsPhaseProductionPlaceFilterService,
		basicsLookupdataLookupFilterService) {

		const siteFilterKey = 'ppsPhaseSiteFilterKey';
		let prodAreaSiteFilter = function (dataItem, entity, settings) {
			return dataItem.SiteTypeFk === 8; // Production Area
		};

		var layoutConfig =
			{
				'fid': 'productionplanning.processconfiguration.phaselayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['ppsformworkfk', 'ppsproductfk', 'ppsphasetypefk', 'actualstart', 'actualfinish', 'plannedstart', 'plannedfinish', 'earlieststart', 'lateststart', 'earliestfinish', 'latestfinish', 'islockedstart', 'islockedfinish']
					},
					{
						gid: 'secondaryPhase',
						attributes: ['dateshiftmode']
					},
					{
						gid: 'location',
						attributes: ['bassitefk', 'ppsproductionplacefk']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {
					ppsphasetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsphasetype',
						null, {}),
					bassitefk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-site-site-lookup',
								lookupOptions: {
									filterKey: siteFilterKey,
									selectableCallback: prodAreaSiteFilter
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SiteNew',
								displayMember: 'Code',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									version: 3,
									filterKey: siteFilterKey,
									selectableCallback: prodAreaSiteFilter
								},
								lookupDirective: 'basics-site-site-lookup',
								descriptionMember: 'DescriptionInfo.Description'
							}
						}
					},
					ppsproductionplacefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'ppsProductionPlaceLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						filterKey: ppsPhaseProductionPlaceFilterService.productionPlaceFilterKey,
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								// changes according to #133890
								args.entity.BasSiteFk = _.get(args.selectedItem, 'BasSiteFk'); // set phase site from prod place
								platformRuntimeDataService.readonly(args.entity, [{field: 'BasSiteFk', readonly: !!args.selectedItem}]); // make phase site readonly
							}
						}]
					}),
					dateshiftmode:  {
						grid: {
							formatter: 'select',
							formatterOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							}
						},
						detail: {
							type: 'select',
							required: false,
							options: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}
					},
					ppsformworkfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'ppsFormworkLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						readonly: true
					}),
					ppsproductfk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CommonProduct',
								displayMember: 'Code',
								version: 3
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'productionplanning-common-product-lookup-new'
							}
						},
						detail: {
							type: 'directive',
							directive: 'productionplanning-common-product-lookup-new',
						},
						readonly: true
					}
				}
			};

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: siteFilterKey,
				fn: function (item, data) {
					return item.SiteTypeFk === 8; //Production Area
				}
			}
		]);

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsPhaseDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		return new BaseService(layoutConfig, ruleSetAttributeDomains, translationService);
	}
})(angular);