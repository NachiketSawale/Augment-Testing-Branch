/**
 * Created by lnt on 26.08.2021.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';
	let cloudCommonModule = 'cloud.common';
	let estimateMainModule = 'estimate.main';
	let basicsCostCodesModule = 'basics.costcodes';
	let basicsMaterialModule = 'basics.material';
	let estimateRuleModule = 'estimate.rule';
	let estimateParamModule = 'estimate.parameter';
	let basicsCustomizeModule = 'basics.customize';
	let basicsUnitModule = 'basics.unit';

	// default grid config
	angular.module(moduleName).value('estimateDefaultGridConfig', {
		initCalled: false,
		columns: [],
		sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true}
	});

	// Layout specs
	angular.module(moduleName).value('estimateAssembliesStructureFormDetailLayout', {
		fid: 'estimate.assemblies.assemblystructuredetailform',
		version: '0.0.1',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['code', 'descriptioninfo', 'param', 'rule', 'minvalue', 'maxvalue', 'estassemblytypefk', 'isshowinleading', 'islive']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		translationInfos: {
			'extraModules': [moduleName, cloudCommonModule, estimateMainModule, basicsCostCodesModule, basicsMaterialModule, estimateRuleModule,
				estimateParamModule, basicsCustomizeModule, basicsUnitModule],
			'extraWords': {
				moduleName: {location: moduleName, identifier: 'moduleName', initial: 'Estimate Assemblies'},
				Code: {location: moduleName, identifier: 'entityCode', initial: 'Code'}
			}
		},
		overloads: {
			'islive': {
				readonly: true
			}
		}
	});

	// TODO: make ngdoc
	angular.module(moduleName).factory('estimateAssembliesStructureUIConfigurationServiceFactory',
		['platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'estimateAssembliesStructureFormDetailLayout', 'basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, estimateAssembliesStructureFormDetailLayout, basicsLookupdataConfigGenerator) {

				let factoryService = {};

				factoryService.createEstAssembliesConfigService = function createEstAssembliesConfigService(isProject) {

					let attributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'EstAssemblyCatDto',
						moduleSubModule: 'Estimate.Assemblies'
					});

					if (attributeDomains) {
						attributeDomains = attributeDomains.properties;
						// add rules and paras
						attributeDomains.Rule = {domain: 'imageselect'};
						attributeDomains.Param = {domain: 'imageselect'};
					}

					if (isProject){
						estimateAssembliesStructureFormDetailLayout.fid = 'project.assembly.assemblystructuredetailform';
						estimateAssembliesStructureFormDetailLayout.overloads.rule = {
							'grid': {
								isTransient: true,
								editor: 'lookup',
								editorOptions: {
									'directive': 'estimate-rule-complex-lookup',
									lookupOptions: {
										'showClearButton': true,
										'showEditButton': false
									}
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									itemServiceName: 'projectAssemblyStructureService',
									itemName: 'EstAssemblyCat',
									serviceName: 'basicsCustomizeRuleIconService'
								}
							}
						};
						estimateAssembliesStructureFormDetailLayout.overloads.param = {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									'directive': 'estimate-param-complex-lookup',
									lookupOptions: {
										'showClearButton': true,
										'showEditButton': false
									}
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateParameterFormatterService',
									dataServiceMethod: 'getItemByParamAsync',
									itemServiceName: 'projectAssemblyStructureService',
									itemName: 'EstAssemblyCat',
									serviceName: 'estimateParameterFormatterService',
									realDataService : 'projectAssemblyStructureService'
								}
							}
						};
					}
					else {
						estimateAssembliesStructureFormDetailLayout.overloads.rule = {
							'detail': {
								'type': 'directive',
								isTransient: true,
								'directive': 'estimate-assembly-rule-complex-lookup',
								'options': {
									'showClearButton': true,
									'showEditButton': false
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateAssembliesRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									serviceName: 'basicsCustomizeRuleIconService'
								}
							},
							'grid': {
								isTransient: true,
								editor: 'lookup',
								editorOptions: {
									'directive': 'estimate-assembly-rule-complex-lookup',
									lookupOptions: {
										'showClearButton': true,
										'showEditButton': false
									}
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateAssembliesRuleFormatterService',
									dataServiceMethod: 'getIconIds',
									serviceName: 'basicsCustomizeRuleIconService'
								}
							}
						};

						estimateAssembliesStructureFormDetailLayout.overloads.param = {
							'detail' : {
								'type': 'directive',
								'isTransient' : true,
								'directive': 'estimate-param-complex-lookup',
								'options': {
									'showClearButton': true,
									'showEditButton': false
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateParameterFormatterService',
									dataServiceMethod: 'getItemByParamAsync',
									itemServiceName: 'estimateMainAssembliesCategoryService',
									itemName: 'EstAssemblyCat',
									serviceName: 'estimateParameterFormatterService',
									realDataService : 'estimateAssembliesAssembliesStructureService'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									'directive': 'estimate-param-complex-lookup',
									lookupOptions: {
										'showClearButton': true,
										'showEditButton': false
									}
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateParameterFormatterService',
									dataServiceMethod: 'getItemByParamAsync',
									itemServiceName: 'estimateMainAssembliesCategoryService',
									itemName: 'EstAssemblyCat',
									serviceName: 'estimateParameterFormatterService',
									realDataService : 'estimateAssembliesAssembliesStructureService'
								}
							}
						};
					}

					// add filter support
					if (estimateAssembliesStructureFormDetailLayout.groups[0].attributes.indexOf('filter') === -1) {
						estimateAssembliesStructureFormDetailLayout.groups[0].attributes.unshift('filter');
					}

					estimateAssembliesStructureFormDetailLayout.overloads.filter = {
						id: 'marker',
						formatter: 'marker',
						field: 'IsMarked',
						name: 'Filter',
						name$tr$: 'estimate.assemblies.filterColumn',
						editor: 'marker',
						pinned: true,
						editorOptions: {
							serviceName: isProject ? 'projectAssemblyStructureService' : 'estimateAssembliesAssembliesStructureService',
							serviceMethod: 'getList',
							multiSelect: false
						}
					};

					attributeDomains.Filter = {'domain': 'marker'};

					estimateAssembliesStructureFormDetailLayout.overloads.estassemblytypefk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						moduleQualifier: 'estimateAssembliesAssemblyTypeLookupDataService',
						dataServiceName: 'estimateAssembliesAssemblyTypeLookupDataService',
						valMember: 'Id',
						dispMember: 'ShortKeyInfo.Translated'
					});

					function EstimateAssembliesUIStandardService(layout, scheme, translateService) {
						platformUIStandardConfigService.call(this, layout, scheme, translateService);
					}

					EstimateAssembliesUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
					EstimateAssembliesUIStandardService.prototype.constructor = EstimateAssembliesUIStandardService;


					return new EstimateAssembliesUIStandardService(estimateAssembliesStructureFormDetailLayout, attributeDomains, estimateAssembliesTranslationService);
				};

				return factoryService;
			}
		]);
})();
