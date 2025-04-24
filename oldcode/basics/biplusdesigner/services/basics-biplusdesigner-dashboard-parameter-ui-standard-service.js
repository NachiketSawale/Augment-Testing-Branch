(function () {
	'use strict';
	var moduleName = 'basics.biplusdesigner';

	angular.module(moduleName).factory('basicsBiPlusDesignerDashboardParameterLayout', basicsBiPlusDesignerDashboardParameterLayout);

	basicsBiPlusDesignerDashboardParameterLayout.$inject = [];

	function basicsBiPlusDesignerDashboardParameterLayout() {
		return {
			'fid': 'basics.biplusdesigner.dashboard.parameter.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['descriptioninfo', 'name', 'datatype', 'syscontext', 'default', 'sorting', 'isvisible', 'datasource']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [
					'basics.biplusdesigner'
				],
				'extraWords': {
					'Description': {location: 'basics.biplusdesigner', identifier: 'description', initial: 'Description'},
					'BasDashboardFk': {location: 'basics.biplusdesigner', identifier: 'entityBasDashboardFk', initial: 'Dashboard'},
					'Sorting': {location: 'basics.biplusdesigner', identifier: 'Sorting', initial: 'Sort Order'},
					'IsVisible': {location: 'basics.biplusdesigner', identifier: 'entityIsVisible ', initial: 'IsVisible '},
					'Name': {location: 'basics.biplusdesigner', identifier: 'entityName', initial: 'Name'},
					'DataType': {location: 'basics.biplusdesigner', identifier: 'entityDataType', initial: 'Data Type'},
					'SysContext': {location: 'basics.biplusdesigner', identifier: 'entitySysContext', initial: 'SysContext'},
					'Default': {location: 'basics.biplusdesigner', identifier: 'entityDefault', initial: 'Default'},
					'DataSource': {location: 'basics.biplusdesigner', identifier: 'entityDataSource', initial: 'Data Source'}
				}
			},
			'overloads': {
				'syscontext': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-common-syscontext-items-lookup'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SysContextItemsLookup',
							displayMember: 'description',
							dataServiceName: 'basicsBiPlusDesignerSysContextItemsLookupDataService'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-common-syscontext-items-lookup',
							'lookupOptions': {
								'valueMember': 'Id',
								'displayMember': 'description'
							}
						},
						'width': 150
					}
				},
				'isvisible': {
					'readonly': true
				},
				'datatype': {
					'readonly': true
				},
				'datasource': {
					'readonly': true
				}
			}
		};
	}

	angular.module(moduleName).factory('basicsBiPlusDesignerDashboardParameterUIStandardService',
		['platformUIStandardConfigService', 'basicsBiPlusDesignerTranslationService', 'basicsBiPlusDesignerDashboardParameterLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DashboardParameterDto',
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
		]);
})();
