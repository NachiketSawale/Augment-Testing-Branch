/**
 * Created by wuj on 9/2/2015.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementconfiguration';
	angular.module(modName)
		.factory('basicsProcurementConfiguration2Prj2TextTypeLayout',
			[function () {
				return {
					//'fid': 'basics.procurementconfiguration.2prj2texttype',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['prjprojectfk','prctexttypefk','bastextmodulefk']
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							PrjProjectFk: {
								location: 'cloud.common', identifier: 'entityProjectNo', initial: 'Project No.'
							},
							PrcTexttypeFk: {
								location: modName,
								identifier: 'textType',
								initial: 'Text Type'
							},
							BasTextModuleFk: {
								location: modName,
								identifier: 'textModule',
								initial: 'Text Module'
							},
						}
					},
					'overloads': {
						'prjprojectfk': {
							// 'navigator': {
							//     moduleName: 'project.main'
							// },
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'procurement-project-lookup-dialog',
									'displayMember': 'ProjectName',
									'lookupOptions': {
										'filterKey': 'prc-invoice-header-project-filter',
										//'showClearButton': true
									},
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'PrcProject', 'displayMember': 'ProjectNo'
								},
								'width': 100
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'procurement-project-lookup-dialog',
									'descriptionMember': 'ProjectName',
									'lookupOptions': {
										'showClearButton': true,
										'lookupKey': 'prc-invoice-header-project-property',
										'filterKey': 'prc-invoice-header-project-filter'
									}
								}
							}
						},
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
						'bastextmodulefk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'basics-text-module-lookup',
									//lookupOptions: {filterKey: 'basics-procurement-configuration-item-text-filter'}
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
									//filterKey: 'basics-procurement-configuration-item-text-filter',
									'descriptionMember': 'DescriptionInfo.Translated'
								}
							}
						}
					},
					'addition': {
						grid: [
							{
								'lookupDisplayColumn': true,
								'field': 'PrjProjectFk',
								'displayMember': 'ProjectName',
								'name$tr$': 'cloud.common.entityProjectName',
								'width': 100
							},
						]
					}
				};
			}])
		.factory('basicsProcurementConfiguration2Prj2TextTypeUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfiguration2Prj2TextTypeLayout', 'platformSchemaService','platformUIStandardExtentService',
				function (platformUIStandardConfigService, translationService,
					layout, platformSchemaService,platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfiguration2Prj2TextTypeDto',
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

					var service = new BaseService(layout, domainSchema, translationService);
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

					return service;
				}
			]);
})();