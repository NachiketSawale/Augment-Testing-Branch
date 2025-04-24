/**
 * Created by wuj on 9/2/2015.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementconfiguration';
	angular.module(modName)
		.factory('basicsProcurementConfiguration2HeaderTextLayout',
			['basicsLookupdataConfigGenerator',function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurementconfiguration.2headerText.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['prctexttypefk','bastextmoduletypefk','bastextmodulefk', 'isrubricbased']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							PrcTextTypeFk: {
								location: modName,
								identifier: 'textType',
								initial: 'Text Type'
							},
							BasTextModuleTypeFk: {
								location: modName,
								identifier: 'textModuleType',
								initial: 'Text Module Type'
							},
							BasTextModuleFk: {
								location: modName,
								identifier: 'textModule',
								initial: 'Text Module'
							},
							IsRubricBased: {
								location: modName,
								identifier: 'isRubricBased',
								initial: 'Rubric Based'
							}
						}
					},
					'overloads': {
						'prctexttypefk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'basics-procurement-configuration-text-type-combobox',
									lookupOptions: {filterKey: 'basics-procurement-configuration-header-text-filter'}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'PrcTextType',
									'displayMember': 'DescriptionInfo.Translated'
								},
								'width': 120
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurement-configuration-text-type-combobox',
								'options': {
									filterKey: 'basics-procurement-configuration-header-text-filter',
									'descriptionMember': 'DescriptionInfo.Translated'
								}
							}
						},
						'bastextmoduletypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmoduletype'),
						'bastextmodulefk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'basics-text-module-lookup',
									lookupOptions: {filterKey: 'basics-procurement-configuration-text-textmoudle-filter'}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'TextModule',
									'displayMember': 'DescriptionInfo.Translated'
								},
								'width': 120
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-text-module-lookup',
								'options': {
									filterKey: 'basics-procurement-configuration-text-textmoudle-filter',
									'descriptionMember': 'DescriptionInfo.Translated'
								}
							}
						}
					}
				};
			}])
		.factory('basicsProcurementConfiguration2HeaderTextUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfiguration2HeaderTextLayout', 'platformSchemaService',
				function (platformUIStandardConfigService, translationService,
								  layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfiguration2TextTypeDto',
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
			])
		.factory('basicsProcurementConfiguration2ItemTextLayout',
			['basicsLookupdataConfigGenerator',function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurementconfiguration.2itemText.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['prctexttypefk','bastextmoduletypefk','bastextmodulefk', 'isrubricbased']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							PrcTextTypeFk: {
								location: modName,
								identifier: 'textType',
								initial: 'Text Type'
							},
							BasTextModuleTypeFk: {
								location: modName,
								identifier: 'textModuleType',
								initial: 'Text Module Type'
							},
							BasTextModuleFk: {
								location: modName,
								identifier: 'textModule',
								initial: 'Text Module'
							},
							IsRubricBased: {
								location: modName,
								identifier: 'isRubricBased',
								initial: 'Rubric Based'
							}
						}
					},
					'overloads': {
						'prctexttypefk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'basics-procurement-configuration-text-type-combobox',
									lookupOptions: {filterKey: 'basics-procurement-configuration-item-text-filter'}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'PrcTextType',
									'displayMember': 'DescriptionInfo.Translated'
								},
								'width': 120
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurement-configuration-text-type-combobox',
								'options': {
									filterKey: 'basics-procurement-configuration-item-text-filter',
									'descriptionMember': 'DescriptionInfo.Translated'
								}
							}
						},
						'bastextmoduletypefk':  basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmoduletype'),
						'bastextmodulefk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'basics-text-module-lookup',
									lookupOptions: {filterKey: 'basics-procurement-configuration-text-textmoudle-filter'}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'TextModule',
									'displayMember': 'DescriptionInfo.Translated'
								},
								'width': 120
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-text-module-lookup',
								'options': {
									filterKey: 'basics-procurement-configuration-text-textmoudle-filter',
									'descriptionMember': 'DescriptionInfo.Translated'
								}
							}
						}
					}
				};
			}])
		.factory('basicsProcurementConfiguration2ItemTextUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfiguration2ItemTextLayout', 'platformSchemaService',
				function (platformUIStandardConfigService, translationService,
								  layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfiguration2TextTypeItemDto',
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
})();