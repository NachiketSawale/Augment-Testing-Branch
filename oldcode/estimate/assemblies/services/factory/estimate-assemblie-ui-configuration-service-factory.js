/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.assemblies';

	// TODO: refactor translation
	// Layout specs
	angular.module(moduleName).value('estimateAssembliesFormDetailLayout', {
		fid: 'estimate.assemblies.detailform',
		version: '0.0.2',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				'gid': 'basicData',
				'attributes': ['code', 'descriptioninfo', 'estassemblycatfk', 'rule', 'param',
					'quantitydetail', 'quantity', 'basuomfk', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
					'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal', 'costunit', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costunittarget', 'costtotal', 'hoursunit', 'hoursunittarget',
					'hourstotal', 'prcstructurefk', 'estcostriskfk', 'mdcassetmasterfk', 'islumpsum', 'isdisabled','isgc', 'commenttext', 'mdccostcodefk', 'mdcmaterialfk','markupcostunit', 'markupcostunittarget', 'markupcosttotal', 'grandtotal',
					'dircostunit',  'dircostunittarget', 'dircosttotal', 'indcostunit', 'indcostunittarget','indcosttotal', 'noleadquantity', 'dayworkrateunit', 'dayworkratetotal', 'lgmjobfk','isdissolvable',
					'co2sourcetotal', 'co2projecttotal', 'co2totalvariance','transfermdccostcodefk','transfermdcmaterialfk'
				]
			},
			{
				'gid': 'userDefText',
				'isUserDefText': true,
				'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		overloads: {
			'descriptioninfo':{
				maxLength : 255
			},
			'mdccostcodefk': {
				'grid': {
					'formatter': 'lookup',
					'formatterOptions': {
						'lookupType': 'costcode',
						'displayMember': 'Code',
						'dataServiceName': 'estimateMainLookupService'
					},
					'editor': 'lookup',
					'editorOptions': {
						'lookupField': 'CostCodeFk',
						'lookupOptions': {
							'showClearButton': true,
							'userDefinedConfigService': 'estimateAssembliesResourceDynamicUserDefinedColumnService',
							isTextEditable: true,
							isFastDataRecording: true
						},
						'directive': 'estimate-main-assembly-cost-codes-lookup'
					}
				}
			},
			'mdcmaterialfk': {
				'grid': {
					'formatter': 'lookup',
					'formatterOptions': {
						'lookupType': 'MaterialCommodity',
						'displayMember': 'Code'
					},
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {
							'showClearButton': true
						},
						'directive': 'estimate-main-assembly-material-lookup'
					}
				}
			},
			'transfermdccostcodefk':{
				'grid': {
					'formatter': 'lookup',
					'formatterOptions': {
						'lookupType': 'costcode',
						'displayMember': 'Code',
						'dataServiceName': 'estimateMainLookupService'
					},
					'editor': 'lookup',
					'editorOptions': {
						'lookupField': 'CostCodeFk',
						'lookupOptions': {
							'showClearButton': true,
							'userDefinedConfigService': 'estimateAssembliesResourceDynamicUserDefinedColumnService'
						},
						'directive': 'estimate-main-assembly-transfer-cost-codes-lookup'
					}
				},
				'detail': {
					'type': 'directive',
					'directive': 'estimate-main-assembly-cost-codes-lookup',
					'options': {
						'lookupDirective': 'estimateMainLookupService',
						'descriptionField': 'DescriptionInfo',
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupOptions': {
							'initValueField': 'Code',
							'showClearButton': true
						}
					}
				}
			},
			'transfermdcmaterialfk':{
				'grid': {
					'formatter': 'lookup',
					'formatterOptions': {
						'lookupType': 'MaterialCommodity',
						'displayMember': 'Code'
					},
					'editor': 'lookup',
					'editorOptions': {
						'lookupOptions': {
							'showClearButton': true,
							'filterKey': 'estimate-main-assembly-transfer-material-Lookup-filter'
						},
						'directive': 'estimate-main-assembly-material-lookup'
					}
				},
				'detail': {
					'type': 'directive',
					'directive': 'estimate-main-assembly-material-lookup',
					'options': {
						'lookupDirective': 'estimateMainLookupService',
						'descriptionField': 'DescriptionInfo',
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupOptions': {
							'initValueField': 'Code',
							'showClearButton': true
						}
					}
				}
			},
			'param': {
				'detail' : {
					'type': 'directive',
					'isTransient' : true,
					'directive': 'estimate-param-complex-lookup',
					'options': {
						'showClearButton': true,
						'showEditButton': false,
						'itemName': 'AssembliesEstLineItems'
					},
					formatter: 'imageselect',
					formatterOptions: {
						dataServiceName: 'estimateParameterFormatterService',
						dataServiceMethod: 'getItemByParamAsync',
						itemServiceName: 'estimateMainService',
						itemName: 'EstLineItems',
						serviceName: 'estimateParameterFormatterService'
					}
				},
				'grid': {
					isTransient: true,
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
						itemServiceName: 'estimateMainService',
						itemName: 'EstLineItems',
						serviceName: 'estimateParameterFormatterService',
						realDataService : 'estimateAssembliesService'
					}
				}
			},
			'dircostunit': {'readonly': true,'grouping':{'generic':false}},
			'dircostunittarget': {'readonly': true,'grouping':{'generic':false}},
			'dircosttotal': {'readonly': true,'grouping':{'generic':false}},
			'indcostunit': {'readonly': true,'grouping':{'generic':false}},
			'indcostunittarget': {'readonly': true,'grouping':{'generic':false}},
			'indcosttotal': {'readonly': true,'grouping':{'generic':false}},
			'dayworkratetotal': {'readonly': true,'grouping':{'generic':false}},
			'dayworkrateunit': {'readonly': true,'grouping':{'generic':false}}
		}
	});

	// TODO: make ngdoc
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateAssembliesUIConfigurationServiceFactory',
		['$injector', 'platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'estimateAssembliesFormDetailLayout', 'estimateMainUIConfigurationService',
			'basicsLookupdataConfigGenerator',
			function ($injector, platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, estimateAssembliesFormDetailLayout, estimateMainUIConfigurationService,
				basicsLookupdataConfigGenerator) {

				let factoryService = {};

				factoryService.createEstAssembliesListUIConfigService = function createEstAssembliesListUIConfigService(isProject, isPlant, isProjectPlantAssembly) {

					function getAssembliesDetailLayout(isProject, isPlant, isProjectPlantAssembly) {
						let lineItemLayoutOverloads = estimateMainUIConfigurationService.getEstimateMainLineItemDetailLayout().overloads;

						// add overloads from estimate main line items
						_.each(estimateAssembliesFormDetailLayout.groups[0].attributes, function (attr) {
							let overload = lineItemLayoutOverloads[attr];
							if(overload){
								if (isProject || isPlant || isProjectPlantAssembly){

									if(overload.detail && overload.detail.options && overload.detail.options.decimalPlaces){
										_.unset(overload.detail.options, 'decimalPlaces');
									}

									if(overload.grid){
										if(overload.grid.editorOptions && overload.grid.editorOptions.decimalPlaces){
											_.unset(overload.grid.editorOptions, 'decimalPlaces');
										}
										if(overload.grid.formatterOptions && overload.grid.formatterOptions.decimalPlaces){
											_.unset(overload.grid.formatterOptions, 'decimalPlaces');
										}
									}
								}
								if (attr !== 'rule' && attr !== 'param') { // don't override the rule attribute
									estimateAssembliesFormDetailLayout.overloads[attr] = overload; // todo test this for project assembly & plant assembly

								}
							}
						});

						if (isPlant || isProjectPlantAssembly){
							_.remove(estimateAssembliesFormDetailLayout.groups[0].attributes, function(attr) {
								return attr === 'estassemblycatfk';
							});

						}else{
							estimateAssembliesFormDetailLayout.overloads.estassemblycatfk = {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'estimate-assemblies-category-lookup',
										'lookupOptions': {
											'showClearButton': true,
											'additionalColumns': true,
											'displayMember': 'Code'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										dataServiceName: 'estimateAssembliesCategoryLookupDataService',
										'lookupType': isProject ? 'ProjectAssembliesCategoryLookup' : 'AssembliesCategoryLookup',
										'displayMember': 'Code',
										'valueMember': 'Id',
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'estimate-assemblies-category-lookup',
									'options': {
										'lookupDirective': 'estimateAssembliesCategoryLookupDataService',
										'descriptionField': 'DescriptionInfo',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'initValueField': 'Code',
											'showClearButton': true
										}
									}
								}
							};
						}

						if (isProject){
							let jobAttr = _.find(estimateAssembliesFormDetailLayout.groups[0].attributes, function(attr) {
								return attr === 'lgmjobfk';
							});
							if(!jobAttr){
								estimateAssembliesFormDetailLayout.groups[0].attributes.push('lgmjobfk');
							}
							estimateAssembliesFormDetailLayout.overloads.lgmjobfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'logisticJobLookupByProjectDataService',
								cacheEnable: true,
								additionalColumns: false,
								readonly: true,
								filter: function () {
									return $injector.get('projectMainService').getSelected().Id;
								}
							});
						}
						else {
							_.remove(estimateAssembliesFormDetailLayout.groups[0].attributes, function(attr) {
								return attr === 'lgmjobfk';
							});
						}

						if (isProject || isPlant || isProjectPlantAssembly){
							estimateAssembliesFormDetailLayout.overloads.rule = {
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
										itemServiceName: isProject ? 'projectAssemblyMainService' : 'estimateMainService',
										itemName: 'EstLineItems',
										serviceName: 'basicsCustomizeRuleIconService'
									}
								}
							};

							estimateAssembliesFormDetailLayout.overloads.param = {
								'detail' : {
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
										dataServiceMethod: 'getIconIds',
										serviceName: 'basicsCustomizeRuleIconService'
									}
								},
								'grid': {
									isTransient: true,
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
										itemServiceName: isProject ? 'projectAssemblyMainService' : 'estimateMainService',
										itemName: 'EstLineItems',
										serviceName: 'estimateParameterFormatterService',
										acceptFalsyValues: true
									},
									bulkSupport: false
								}
							};

							estimateAssembliesFormDetailLayout.overloads.mdccostcodefk = {
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'costcode',
										'displayMember': 'Code',
										'dataServiceName': 'estimateMainLookupService'
									},
									'editor': 'lookup',
									'editorOptions': {
										'lookupField': 'CostCodeFk',
										'lookupOptions': {
											'showClearButton': true,
											'userDefinedConfigService': 'projectAssemblyResourceDynamicUserDefinedColumnService',
											isTextEditable: true,
											isFastDataRecording: true
										},
										'directive': 'estimate-main-assembly-cost-codes-lookup'
									}
								}
							};

							if(isProjectPlantAssembly){
								estimateAssembliesFormDetailLayout.groups[0].attributes = estimateAssembliesFormDetailLayout.groups[0].attributes.concat(['lgmjobfk', 'plantgroupfk', 'plantfk']);

								estimateAssembliesFormDetailLayout.overloads.lgmjobfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'logisticJobLookupByProjectDataService',
									readonly: true,
									cacheEnable: true,
									additionalColumns: false,
									filter: function () {
										return  $injector.get('projectMainService').getIfSelectedIdElse(null);
									}
								});

								estimateAssembliesFormDetailLayout.overloads.plantgroupfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'resourceEquipmentGroupLookupDataService',
									readonly: true,
									cacheEnable: true,
									additionalColumns: false,
									filter: function () {
										return  $injector.get('projectMainService').getIfSelectedIdElse(null);
									}
								});

								estimateAssembliesFormDetailLayout.overloads.plantfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'resourceEquipmentPlantLookupDataService',
									readonly: true,
									cacheEnable: true,
									additionalColumns: false,
									filter: function () {
										return  $injector.get('projectMainService').getIfSelectedIdElse(null);
									}
								});
							}
						}
						else {
							estimateAssembliesFormDetailLayout.overloads.rule = {
								'detail' : {
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
										dataServiceMethod: 'getIconIds',
										// itemServiceName: 'estimateMainService',
										// itemName: 'EstLineItems',
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
						}

						return estimateAssembliesFormDetailLayout;
					}

					let attributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'EstLineItemDto',
						moduleSubModule: 'Estimate.Assemblies'
					});

					if (attributeDomains) {
						attributeDomains = attributeDomains.properties;

						// add rules and paras
						attributeDomains.Rule = {domain: 'imageselect'};
						attributeDomains.Param = {domain: 'imageselect'};
					}

					function EstimateAssembliesUIStandardService(layout, scheme, translateService) {
						platformUIStandardConfigService.call(this, layout, scheme, translateService);
					}

					EstimateAssembliesUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
					EstimateAssembliesUIStandardService.prototype.constructor = EstimateAssembliesUIStandardService;

					return new EstimateAssembliesUIStandardService(getAssembliesDetailLayout(isProject, isPlant, isProjectPlantAssembly), attributeDomains, estimateAssembliesTranslationService);
				};

				return factoryService;
			}
		]);
})();
