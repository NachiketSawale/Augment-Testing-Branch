(function () {
	'use strict';
	var modName = 'qto.main',
		mod = angular.module(modName);

	mod.service('qtoMainHeaderLayout', ['$injector','$translate','basicsLookupdataConfigGenerator', function ($injector, $translate,basicsLookupdataConfigGenerator) {
		return {
			'fid': 'qto.main.header',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['qtotypefk', 'qtotargettype', 'basrubriccategoryfk', 'code', 'descriptioninfo', 'qtodate',
						'projectfk', /* 'prcboqfk', */ 'islive', 'clerkfk', 'performedfrom', 'performedto', 'basgoniometertypefk',
						'nodecimals', 'useroundedresults', 'remark','boqheaderfk','qtostatusfk','businesspartnerfk','ordheaderfk', 'conheaderfk','iswq', 'isaq','isiq','isbq','prcstructurefk'
					]
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'overloads': {
				'qtostatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.qtotstatus', null, {
					showIcon: true
				}),
				'prcstructurefk': {
					'readonly': true,
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'basics-procurementstructure-structure-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true
							},
							directive: 'basics-procurementstructure-structure-dialog'
						},
						width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcstructure',
							displayMember: 'Code'
						}
					}
				},

				'businesspartnerfk':{
					'readonly': true,
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-business-partner-dialog',
						'options': {
							'showClearButton': true
						}
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'business-partner-main-business-partner-dialog',
							'lookupOptions': {
								'showClearButton': true
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'BusinessPartner',
							'displayMember': 'BusinessPartnerName1'
						},
						'width': 130
					}
				},
				'basrubriccategoryfk': {
					'readonly': true,
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QtoFormulaRubricCategory',
							displayMember: 'Description'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							lookupOptions: {
								filterKey: 'qto-main-rubric-category-lookup-filter',
								showClearButton: true
							}
						}
					}
				},
				'qtotypefk': {
					'readonly': true,
					'detail': {
						'type': 'directive',
						'directive': 'qto-type-combobox'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QtoType',
							displayMember: 'DescriptionInfo.Translated'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'qto-type-combobox'
						}
					}
				},
				'qtotargettype': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.qtopurposetype', null, {readonly: true}),
				'code': {
					width: 200,
					'grid': {
						'formatter': function(row, cell, value, columnDef, entity) {
							if(entity.PrjChangeStutasReadonly){
								return entity.Code + '<i class="block-image status-icons ico-status33" style="float:right" title="' + $translate.instant('qto.main.prjChangeStatusReadOnlyInfo') + '"></i>';
							}else {
								return entity.Code;
							}
						}
					}
				},

				'conheaderfk': {  // procurment contract
					navigator: {
						moduleName: 'procurement.contract'
					},
					'readonly': true,
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'qto-header-procurement-contract-lookup-dialog',
							descriptionMember: 'Description'
						}
					},
					'grid': {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'qto-header-procurement-contract-lookup-dialog',
							lookupOptions: {
								filterKey:'qto-main-header-procurment-contract-filter',
								showClearButton: true,
								displayMember: 'Code',
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 200,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								additionalColumns: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QtoConHeaderView',
							displayMember: 'Code',
							dataServiceName: 'qtoHeaderProcurementContractLookupDialogService'
						},
						bulkSupport: false
					}
				},

				'ordheaderfk': {
					navigator: {
						moduleName: 'sales.contract'
					},
					'readonly': true,
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'qto-header-sales-contract-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					'grid': {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'qto-header-sales-contract-lookup-dialog',
							lookupOptions: {
								filterKey: 'qto-main-header-sales-contract-filter',
								showClearButton: true,
								displayMember: 'Code',
								addGridColumns: [{
									id: 'Description',
									field: 'DescriptionInfo',
									name: 'Description',
									width: 200,
									formatter: 'translation',
									name$tr$: 'cloud.common.entityDescription'
								}],
								additionalColumns: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SalesContractInQto',
							displayMember: 'Code',
							dataServiceName: 'qtoHeaderSalesContractLookupDialogService'
						},
						bulkSupport: false
					}
				},
				/* 'contractcode':{
				 'readonly': true,
				 width:150
				 }, */
				'descriptioninfo': {
					width: 100
				},
				'qtodate': {
					width: 100
				},
				'boqheaderfk': {// 'prcboqfk'
					'readonly': true,
					navigator: {
						moduleName: 'boq.main',
						'navFunc': function (triggerFieldOption, item) {
							let boqRuleComplexLookupService = $injector.get ('boqRuleComplexLookupService');
							if (boqRuleComplexLookupService) {
								boqRuleComplexLookupService.setNavFromBoqProject ();
								$injector.get ('boqMainService').setList ([]);
								let qtoMainHeaderDataService = $injector.get ('qtoMainHeaderDataService');
								if (qtoMainHeaderDataService) {
									qtoMainHeaderDataService.updateAndExecute (function () {
										let projectId = qtoMainHeaderDataService.getSelectedProjectId ();
										boqRuleComplexLookupService.setProjectId (projectId);
										boqRuleComplexLookupService.loadLookupData ().then (function () {
											triggerFieldOption.ProjectFk = projectId;
											triggerFieldOption.NavigatorFrom = 'EstBoqItemNavigator';
											$injector.get ('platformModuleNavigationService').navigate ({moduleName: 'boq.main'}, item, triggerFieldOption);
										});
									});
								}

							}
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'qto-main-project-boq-lookup',// 'qto-main-project-boq-lookup',//'procurement-common-prc-boq-extended-Lookup'
						'options': {
							filterKey: 'qto-main-boq-filter'
						}
					},
					'grid': {
						editor: 'dynamic',
						formatter: 'dynamic',
						domain: function (item, column) {
							var domain;
							domain = 'lookup';
							column.formatterOptions = {
								lookupType: 'PrjBoqExtended',
								dataServiceName:'qtoProjectBoqDataService',
								displayMember: 'Reference'
							};
							return domain;
						},
						width: 100
					}
				},
				'projectfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'qto-header-project-lookup-dialog',
							descriptionField: 'ProjectName',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								filterKey: 'qto-main-header-project-filter',
								initValueField: 'ProjectNo',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function () {
											$injector.get('qtoHeaderPackageLookupDialogService').clear();
										}
									}
								]
							}
						}
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QtoPrcProject',
							displayMember: 'ProjectNo'
						},
						editor: 'lookup',
						editorOptions: {
							'displayMember': 'ProjectName',
							directive: 'qto-header-project-lookup-dialog',
							'lookupOptions': {
								filterKey: 'qto-main-header-project-filter',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function () {
											$injector.get('qtoHeaderPackageLookupDialogService').clear();
										}
									}
								]
							}
						}
					}
				},
				'islive': {
					readonly: true,
					width: 100
				},
				'clerkfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description'
						}
					},
					'grid': {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'cloud-clerk-clerk-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code'// 'Description'
						}
					}
				},
				'performedfrom': {
					width: 100
				},
				'performedto': {
					width: 100
				},
				'basgoniometertypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'qto-formula-gonimeter-lookup'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'gonimeter',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'qto-formula-gonimeter-lookup'
						},
						width: 120
					},
					required: true,
					readonly: false
				},

				'nodecimals': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-common-limit-input',
						'options': {
							validKeys: {
								regular: '^[-+]?[0-9]{0,10}$'
							}
						}
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-limit-input',
							validKeys: {
								regular: '^[1-9]{1}$'
							}
						},
						formatter: 'description'
					}
				},
				'useroundedresults': {
					width: 100
				},
				'remark': {
					width: 100
				}
			},
			'addition': {
				grid: [
					{
						lookupDisplayColumn: true,
						field: 'ProjectFk',
						name$tr$: 'cloud.common.entityProjectName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectName'
						},
						width: 125
					},
					{
						lookupDisplayColumn: true,
						field: 'ClerkFk',
						name$tr$: 'qto.main.contactDescription',
						width: 125
					}
				]
			}
		};
	}]);
	mod.factory('qtoMainHeaderUIStandardService',
		['platformUIStandardConfigService', 'qtoMainTranslationService',
			'qtoMainHeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoHeaderDto',
					moduleSubModule: 'Qto.Main'
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

	mod.factory('qtoMainHeaderProjectUIStandardService',
		['platformUIStandardConfigService', 'qtoMainTranslationService',
			'qtoMainHeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoHeaderDto',
					moduleSubModule: 'Qto.Main'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				let layoutUi = angular.copy(layout);
				layoutUi.overloads.code.navigator = {
					moduleName: modName,
					registerService: 'qtoMainHeaderDataService'
				};
				delete layoutUi.overloads.code.grid;

				var service = new BaseService(layoutUi, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layoutUi.addition, domainSchema);

				return service;
			}
		]);
})();
