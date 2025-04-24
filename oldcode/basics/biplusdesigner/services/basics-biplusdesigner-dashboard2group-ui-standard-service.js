
(function () {
	'use strict';
	var moduleName = 'basics.biplusdesigner';

	var module = angular.module(moduleName);

	module.factory('basicsBiPlusDesignerDashboard2GroupLayout',['$translate','basicsLookupdataConfigGenerator','basicsBiPlusDesignerDashboard2GroupDataService',
		function ($translate,basicsLookupdataConfigGenerator,basicsBiPlusDesignerDashboard2GroupDataService) {
			return {
				'fid': 'basics.biplusdesigner.dashboard2group.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['basdashboardgroupfk','descriptioninfo', 'sorting','isvisible','visibility','frmaccessrightdescriptorfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {

					'extraModules': ['basics.biplusdesigner'],

					'extraWords': {
						'Description': {location: 'basics.biplusdesigner', identifier: 'description', initial: 'Description'},
						'BasDashboardGroupFk': {location: 'basics.biplusdesigner', identifier: 'DashboardGroupFk', initial: 'Dashboard Group Name'},
						'Sorting': {location: 'basics.biplusdesigner', identifier: 'Sorting', initial: 'Sorting'},
						'IsVisible': {location: 'basics.biplusdesigner', identifier: 'IsVisible ', initial: 'IsVisible '},
						'Visibility': {location: 'basics.biplusdesigner', identifier: 'Visibility', initial: 'Visibility'},
						'FrmAccessRightDescriptorFk': {location: 'basics.biplusdesigner', identifier: 'AccessRightDescriptor', initial: 'Access Right Descriptor'}
					}

				},
				'overloads': {
					'basdashboardgroupfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.dashboardgroup', 'Name'),
					'visibility': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-visibility-values-lookup'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'VisibilityValuesLookup',
								displayMember: 'description',
								dataServiceName: 'basicsCommonVisibilityValuesLookupDataService'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-common-visibility-values-lookup',
								'lookupOptions': {
									'valueMember': 'Id',
									'displayMember': 'description'
								}
							},
							'width': 150
						}
					},
					'frmaccessrightdescriptorfk': {
						grid: {
							formatter: 'action',
							forceActionButtonRender: true,
							actionList: [{
								toolTip: function (entity, field) {
									var toolTipText = $translate.instant('basics.customize.createAccessRightDescriptor');
									if (entity && entity[field] && entity.DescriptionInfo) {
										var translatedKey = $translate.instant('basics.customize.accessrightdescriptor');
										toolTipText = translatedKey + ' (' + entity.DescriptionInfo.Description + ')'.substring(0, 205);
									}
									return toolTipText;
								},
								icon: 'control-icons ico-rights-off',
								valueIcon: 'control-icons ico-rights-on',
								callbackFn: function (entity) {
									if (!_.isNil(entity.FrmAccessRightDescriptorFk)) {
										basicsBiPlusDesignerDashboard2GroupDataService.deleteAccessRightDescriptor(entity);
									} else {
										basicsBiPlusDesignerDashboard2GroupDataService.createAccessRightDescriptor(entity);
									}
								}
							}]
						},
						detail: {
							readonly: true
						}
					}
				}
			};
		}]
	);

	angular.module(moduleName).factory('basicsBiPlusDesignerDashboard2GroupUIStandardService',
		['platformUIStandardConfigService', 'basicsBiPlusDesignerTranslationService', 'basicsBiPlusDesignerDashboard2GroupLayout', 'platformSchemaService','platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService,platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'Dashboard2GroupDto',
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

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);
})();