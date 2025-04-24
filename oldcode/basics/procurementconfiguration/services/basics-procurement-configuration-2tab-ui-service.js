/**
 * Created by sfi on 9/2/2015.
 */
(function (angular) {
	'use strict';
	var modName = 'basics.procurementconfiguration';
	angular.module(modName).factory('basicsProcurementConfiguration2TabLayout', ['basicsprocurementconfigurationLookUpItems',
		function (lookUpItems) {
			return {
				'fid': 'basics.procurement.configuration.2tab.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['moduletabfk', 'isdisabled', 'style']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						ModuleTabFk: {location: modName, identifier: 'entityTabName', initial: 'Tab Name '},
						IsDisabled: {location: modName, identifier: 'entityIsDisabled', initial: 'Is Disabled '},
						Style: {location: modName, identifier: 'entityStyle', initial: 'Style'}
					}
				},
				'overloads': {
					'moduletabfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'basics-procurement-configuration-module-tab-combobox',
								lookupOptions: {filterKey: 'basics-procurement-configuration-module-tab-filter'}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ModuleTab',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-module-tab-combobox',
							'options': {
								filterKey: 'basics-procurement-configuration-module-tab-filter',
								'descriptionMember': 'DescriptionInfo.Translated'
							}
						}
					},
					'isdisabled': {
						'detail': {},
						'grid': {
							'width': 80
						}
					},
					'style': {
						'detail': {
							options: {
								displayMember: 'Description',
								valueMember: 'Id',
								items: lookUpItems.styleType
							}
						},
						'grid': {
							editorOptions: {
								displayMember: 'Description',
								valueMember: 'Id',
								items: lookUpItems.styleType
							}
						}
					}
				}
			};
		}]
	)
		.factory('basicsProcurementConfigModule2TabUIStandardService',
			['$translate', 'platformUIStandardConfigService',
				'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfiguration2TabLayout', 'platformSchemaService',
				function ($translate, platformUIStandardConfigService, translationService, layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfiguration2TabDto',
						moduleSubModule: 'Basics.ProcurementConfiguration'
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
})(angular);
