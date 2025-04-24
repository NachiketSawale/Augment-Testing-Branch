(function () {
	'use strict';

	const moduleName = 'basics.biplusdesigner';

	angular.module(moduleName).factory('basicsBiPlusDesignerDashboardLayout', basicsBiPlusDesignerDashboardLayout);

	basicsBiPlusDesignerDashboardLayout.$inject = ['$translate', 'basicsLookupdataConfigGenerator'];

	function basicsBiPlusDesignerDashboardLayout($translate, basicsLookupdataConfigGenerator) {
		return {
			fid: 'basics.biplusdesigner.dashboard.detail',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['nameinfo', 'externalname', 'descriptioninfo', 'externalid', 'basdashboardtypefk', 'sorting', 'isvisible', 'hastranslation']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			translationInfos: {
				extraModules: ['basics.biplusdesigner'],
				extraWords: {
					Description: {location: 'basics.biplusdesigner', identifier: 'description', initial: 'Description'},
					Sorting: {location: 'basics.biplusdesigner', identifier: 'Sorting', initial: 'Sorting'},
					ExternalName: {location: 'basics.biplusdesigner', identifier: 'entityExternalName  ', initial: 'External Name'},
					ExternalId: {location: 'basics.biplusdesigner', identifier: 'entityExternalId', initial: 'External Id '},
					BasDashboardTypeFk: {location: 'basics.biplusdesigner', identifier: 'entityBasDashboardTypeFk ', initial: 'Dashboard Type'},
					NameInfo: {location: 'basics.biplusdesigner', identifier: 'entityName', initial: 'Name'},
					IsVisible: {location: 'basics.biplusdesigner', identifier: 'entityIsVisible', initial: 'Is Visible'},
					IsActive: {location: 'basics.biplusdesigner', identifier: 'entityIsActive', initial: 'Is Active'},
					IsAvailable: {location: 'basics.biplusdesigner', identifier: 'entityIsAvailable', initial: 'Is Available'},
					HasTranslation: {location: 'basics.biplusdesigner', identifier: 'entityHasTranslation', initial: 'Has Translation'}
				}
			},
			overloads: {
				externalname: {
					readonly: true
				},
				externalid: {
					readonly: true
				},
				hastranslation: {
					readonly: true
				},
				descriptioninfo: {
					detail: {},
					grid: {
						searchable: true
					}
				},
				nameinfo: {
					detail: {},
					grid: {
						searchable: true
					}
				},
				basdashboardtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.dashboardtype', 'Description')
			}
		};
	}

	angular.module(moduleName).factory('basicsBiPlusDesignerDashboardUIStandardService', basicsBiPlusDesignerDashboardUIStandardService);

	basicsBiPlusDesignerDashboardUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsBiPlusDesignerTranslationService', 'basicsBiPlusDesignerDashboardLayout', 'platformSchemaService'];

	function basicsBiPlusDesignerDashboardUIStandardService(platformUIStandardConfigService, translationService, layout, platformSchemaService) {
		var BaseService = platformUIStandardConfigService;
		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'DashboardDto',
			moduleSubModule: 'Basics.BiPlusDesigner'
		});

		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		function UIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UIStandardService.prototype = Object.create(BaseService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;

		return new BaseService(layout, domainSchema, translationService);
	}
})();
