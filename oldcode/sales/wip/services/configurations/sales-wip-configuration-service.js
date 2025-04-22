/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipConfigurationService', ['_', 'salesWipService', '$injector', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'salesCommonLookupConfigsService', 'salesWipTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', '$translate', 'platformModuleNavigationService',
		function (_, salesWipService, $injector, platformUIStandardConfigService, platformUIStandardExtentService, salesCommonLookupConfigsService, salesWipTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, $translate, naviService) {

			var detailsOverload = {
					'readonly': true,
					'grid': {
						formatter: function (row, cell, value) {
							return angular.uppercase(value);
						}
					}
				},
				// TODO: addColumns seems to be never used. Please check.
				// addColumns = [{
				//    id: 'Description',
				//    field: 'DescriptionInfo',
				//    name: 'Description',
				//    width: 300,
				//    formatter: 'translation',
				//    name$tr$: 'cloud.common.entityDescription'
				// }],
				getEstQtyRel = {
					'readonly': true,
					'grid': {
						formatter: 'imageselect',
						formatterOptions: {
							serviceName: 'basicsEstimateQuantityRelationIconService'
						}
					}
				};

			var wipsForProjectDetailLayout = {
				'fid': 'sales.wip.wips.detailform',
				'version': '0.5.0',
				'change': 'change',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'rubriccategoryfk', 'configurationfk', 'companyresponsiblefk', 'projectfk', 'billingschemafk', // TODO: check other fks to include here
							'languagefk', 'wipstatusfk', 'code', 'descriptioninfo', 'currencyfk', 'exchangerate',
							'clerkfk', 'ordheaderfk', 'prevwipheaderfk', 'objunitfk', 'isbilled', 'isnotaccrual', 'amountnet', 'amountgross', 'amountnetoc', 'amountgrossoc',
							'controllingunitfk', 'prcstructurefk', 'dateeffective',
							'qtoheaderfk','bassalestaxmethodfk', 'iscanceled','factordjc'
						]
					},
					{
						'gid': 'customerData',
						'attributes': [
							'documentdate', 'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'contactfk'
						]
					},
					{
						'gid': 'paymentData',
						'attributes': [
							'paymenttermfifk', 'paymenttermpafk', 'paymenttermadfk', 'taxcodefk', 'vatgroupfk'
						]
					},
					{
						'gid': 'datesData',
						'attributes': [
							'performedfrom', 'performedto'
						]
					},
					{
						'gid': 'otherData',
						'attributes': [
							'remark', 'commenttext'
						]
					},
					{
						'gid': 'userDefText',
						'isUserDefText': true,
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'userDefDates',
						'attributes': ['userdefineddate01', 'userdefineddate02', 'userdefineddate03', 'userdefineddate04', 'userdefineddate05']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {
					'ordheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'salesCommonContractLookupDataService',
						moduleQualifier: 'salesCommonContractLookupDataService',
						filter: function (item) {
							return item && item.ProjectFk ? item.ProjectFk : -1;
						},
						readonly: true,
						navigator: {
							moduleName: 'sales.contract'
						}
					}),
					'prevwipheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'salesCommonWipLookupDataService',
						moduleQualifier: 'salesCommonWipLookupDataService',
						filter: function (item) {
							return item && item.ProjectFk ? item.ProjectFk : -1;
						},
						readonly: true
					}),
					wipstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.workinprogressstatus', null, {
						showIcon: true
					}),
					'isbilled': {
						readonly: true
					},
					'amountnet': {
						readonly: true
					},
					'amountnetoc': {
						readonly: true
					},
					'amountgross': {
						readonly: true
					},
					'amountgrossoc': {
						readonly: true
					},
					'factordjc': {
						readonly: true
					},
					'code': {
						readonly: true,
						mandatory: true,
						searchable: true,
						navigator: {
							moduleName: 'sales.wip',
							registerService: 'salesWipService'
						}
					},
					qtoheaderfk: {
						readonly: true,
						required: false,
						navigator: {
							moduleName: 'qto.main'
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'qto-header-dialog',
								descriptionMember: 'Description'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'qto-header-dialog',
								lookupOptions: {
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
								lookupType: 'QtoHeader',
								displayMember: 'Code'
							}
						}
					},
					contactfk: {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-filtered-contact-combobox',
							options: {
								initValueField: 'FamilyName',
								filterKey: 'sales-wip-contact-by-bizpartner-server-filter',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-filtered-contact-combobox',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'sales-wip-contact-by-bizpartner-server-filter'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'FamilyName'
							}
						}
					},
					'taxcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							},
							'change': 'formOptions.onPropertyChanged'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-master-data-context-tax-code-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							width: 100
						}
					},
					'businesspartnerfk': $injector.get('salesCommonLookupConfigsService').BusinessPartnerLookupConfig('salesWipService'),
				}
			};

			function getProjectChangeLookupOptions() {
				return {
					showClearButton: true,
					filterOptions: {
						serverKey: 'sales-contract-project-change-common-filter',
						serverSide: true,
						fn: function () {
							return {
								ProjectFk: salesWipService.getSelected() ?
									salesWipService.getSelected().ProjectFk : 0
							};
						}
					}
				};
			}

			var getSalesWipEstLineItemLayout = function () {
				return {
					'fid': 'estimate.main.lineItem.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['statusoflineitemassignedtopackage', 'info', 'projectno', 'projectname', 'estimationcode', 'estimationdescription', 'rule', 'param', 'code', 'estassemblyfk', 'descriptioninfo',
								'estlineitemfk', 'quantitytargetdetail', 'quantitytarget', 'wqquantitytarget',
								'basuomtargetfk', 'quantitydetail', 'quantity', 'basuomfk', 'externalcode', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
								'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal', 'costunit', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costunittarget',
								'costtotal', 'hoursunit', 'hoursunittarget', 'hourstotal', 'estcostriskfk', 'mdccontrollingunitfk', 'boqrootref', 'boqitemfk', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk',
								'mdcassetmasterfk', 'prjlocationfk', 'prcstructurefk', 'estqtyrelboqfk', 'estqtyrelactfk', 'estqtyrelgtufk', 'estqtytelaotfk', 'prjchangefk', 'islumpsum', 'isdisabled', 'isgc', 'commenttext',
								'entcostunit', 'entcostunittarget', 'entcosttotal', 'enthoursunit', 'enthoursunittarget', 'enthourstotal',
								'drucostunit', 'drucostunittarget', 'drucosttotal', 'druhoursunit', 'druhoursunittarget', 'druhourstotal',
								'dircostunit', 'dircostunittarget', 'dircosttotal', 'dirhoursunit', 'dirhoursunittarget', 'dirhourstotal',
								'indcostunit', 'indcostunittarget', 'indcosttotal', 'indhoursunit', 'indhoursunittarget', 'indhourstotal',
								'cosinstancecode', 'cosinstancedescription', 'cosmasterheadercode', 'cosmasterheaderdescription', 'fromdate', 'todate',
								'sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk', 'lipreviousquantity', 'liquantity', 'litotalquantity', 'lipercentagequantity', 'licumulativepercentage']
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
					// TODO: rename
					'overloads': {
						statusoflineitemassignedtopackage: {
							readonly: true,
							grid: {
								field: 'statusImage',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'salesCommonLineItemStatusProcessor',
									tooltip: true
								}
							}
						},
						'info': {
							'readonly': true,
							'grid': {
								field: 'image',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'estimateMainLineItemImageProcessor'
								}
							}
						},
						'quantitydetail': detailsOverload,
						'quantitytargetdetail': detailsOverload,
						'quantityfactordetail1': detailsOverload,
						'quantityfactordetail2': detailsOverload,
						'productivityfactordetail': detailsOverload,
						'costfactordetail1': detailsOverload,
						'costfactordetail2': detailsOverload,
						'projectno': {
							readonly: true
						},
						'projectname': {
							readonly: true
						},
						estimationcode: {
							readonly: true
						},
						estimationdescription: {
							readonly: true
						},
						'rule': {
							'readonly': true,
							'grid': {
								isTransient: true,
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'basicsCustomizeRuleIconService'
								}
							}
						},
						'param': {
							'readonly': true,
							'grid': {
								isTransient: true,
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateParameterFormatterService',
									dataServiceMethod: 'getItemByParamAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'estimateParameterFormatterService'
								}
							}
						},
						'code': {
							'mandatory': true,
							'searchable': true,
							'navigator': {
								moduleName: $translate.instant(moduleName + '.estimateLineItemGridContainerTitle'),
								navFunc: function (item, triggerField) {

									var navigator = naviService.getNavigator('estimate.main-line-item');
									var salesWipService = $injector.get('salesWipService');
									var projectId = salesWipService.getSelected().ProjectFk;

									angular.extend(triggerField, {
										ProjectContextId: projectId
									});

									naviService.navigate(navigator, item, triggerField);
								}
							},
							'readonly': true
						},

						// TODO, this changes according to Estimate.Main
						// 'estlineitemfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
						//  dataServiceName: 'estLineItemRefLookupDataService',
						//  valMember: 'Id',
						//  dispMember: 'Code',
						//  filter: function (item) {
						//      var estHeaderId = item && item.EstHeaderFk ? item.EstHeaderFk :procurementPackageDataService.getSelected().EstHeaderFk;
						//      var id = item && item.Id ? item.Id  : procurementPackageDataService.getSelected().Id;
						//      return estHeaderId + '&id=' + id;
						//  }
						// }),
						'estlineitemfk': {
							'readonly': true,
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-est-line-item-lookup-dialog',
									lookupOptions: {
										'displayMember': 'Code'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemlookup',
									displayMember: 'Code'
								}
							},
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'estimate-main-est-line-item-lookup-dialog',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							}
						},

						estassemblyfk: {
							// TODO, I will test this navigator works or not later
							navigator: {
								moduleName: 'estimate.assemblies'
							},
							'readonly': true,
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estassemblyfk',
									displayMember: 'Code'
								}
							}
						},

						'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							'readonly': true,
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}, {required: false}),

						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							'readonly': true,
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),

						'estcostriskfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description', {showClearButton: true}),
						'externalcode': detailsOverload,
						'mdccontrollingunitfk': {
							navigator: {
								moduleName: 'controlling.structure'
							},
							'readonly': true,
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Controllingunit',
									displayMember: 'Code'
								}
							}
						},

						'boqitemfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'salesWipBoqLookupDataService',
							// displayMember: 'Reference',
							isComposite: true,
							desMember: 'BriefInfo.Translated',
							dispMember: 'Reference',
							cacheEnable: true,
							'readonly': true,
							filter: function (item) {
								return item.BoqHeaderFk;
							}
						}),

						'boqrootref': {
							'readonly': true,
							'grid': {
								field: 'BoqHeaderFk',
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'Reference',
									dataServiceName: 'salesWipBoqRootLookupDataService',
									dataServiceMethod: 'getItemByIdAsync'
								}
							}
						},

						/* 'boqrootref': {
							'readonly': true,
							'grid': {
								field: 'BoqItemFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estboqitems',
									displayMember: 'Reference',
									dataServiceName: 'estimateMainBoqRootLookupService'
								}
							}
						},

						'boqitemfk': {
							navigator: {
								moduleName: 'boq.main'
							},
							'readonly': true,
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estboqitems',
									displayMember: 'Reference',
									dataServiceName: 'estimateMainBoqLookupService'
								}
							}
						}, */

						'psdactivityschedule': {
							'navigator': {
								moduleName: 'scheduling.main'
							},
							'readonly': true,
							'grid': {
								field: 'PsdActivityFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityScheduleLookupService'
								}
							}
						},

						'psdactivityfk': {
							'navigator': {
								moduleName: 'scheduling.main'
							},
							'readonly': true,
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityLookupService'
								}
							}
						},
						'prjlocationfk': {
							navigator: {
								moduleName: 'project.main-location'
							},
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'ProjectLocation',
									'displayMember': 'Code'
								}
							}
						},

						'mdcworkcategoryfk': {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'WorkCategory',
									'displayMember': 'Code'
								}
							}
						},

						'mdcassetmasterfk': {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'AssertMaster',
									'displayMember': 'Code'
								}
							}
						},

						'prcstructurefk': {
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'prcstructure',
									'displayMember': 'Code'
								}
							}
						},
						'prjchangefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'project-change-dialog',
									lookupOptions: getProjectChangeLookupOptions()
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'projectchange',
									displayMember: 'Code'
								},
								width: 130
							}
						},
						'estqtyrelboqfk': angular.copy(getEstQtyRel),
						'estqtyrelactfk': angular.copy(getEstQtyRel),
						'estqtyrelgtufk': angular.copy(getEstQtyRel),
						'estqtytelaotfk': angular.copy(getEstQtyRel),
						cosinstancecode: {
							readonly: true,
							navigator: {
								moduleName: 'constructionsystem.main'
							}
						},
						cosmasterheaderdescription: {
							readonly: true
						},
						cosmasterheadercode: {
							readonly: true,
							navigator: {
								moduleName: 'constructionsystem.master'
							}
						},
						cosinstancedescription: {
							readonly: true
						},
						'fromdate': {
							'readonly': true,
							formatter: 'dateutc'
						},
						'todate': {
							'readonly': true,
							formatter: 'dateutc'
						},
						'sortcode01fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode01LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode02fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode02LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode03fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode03LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode04fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode04LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode05fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode05LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode06fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode06LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode07fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode07LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode08fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode08LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode09fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode09LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						}),
						'sortcode10fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode10LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesWipService.getSelectedProjectId();
							}
						})
					},
					'addition': {
						'grid': [
							{
								'lookupDisplayColumn': true,
								'field': 'PrjChangeFk',
								'displayMember': 'Description',
								'name$tr$': 'procurement.common.reqheaderChangeRequestDescription',
								'width': 155
							}
						]
					}
				};
			};


			salesCommonLookupConfigsService.addCommonLookupsToLayout(wipsForProjectDetailLayout);
			salesCommonLookupConfigsService.registerCommonFilters();

			var BaseService = platformUIStandardConfigService;

			var salesWipHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'WipHeaderDto',
				moduleSubModule: 'Sales.Wip'
			});

			if (salesWipHeaderDomainSchema) {
				salesWipHeaderDomainSchema = salesWipHeaderDomainSchema.properties;
			}

			function SalesWipUIStandardService(layout, scheme, translateService, entityInfo) {
				BaseService.call(this, layout, scheme, translateService, entityInfo);
			}
			var entityInformation = { module: angular.module('sales.wip'), moduleName: 'Sales.Wip', entity: 'WipHeader' };
			SalesWipUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesWipUIStandardService.prototype.constructor = SalesWipUIStandardService;
			var service = new BaseService(wipsForProjectDetailLayout, salesWipHeaderDomainSchema, salesWipTranslationService, entityInformation);

			// TODO: #144627 refactor+simplify
			wipsForProjectDetailLayout.overloads.rubriccategoryfk.grid.editorOptions.lookupOptions.filterKey = 'sales-wip-rubric-category-by-rubric-filter';
			wipsForProjectDetailLayout.overloads.rubriccategoryfk.detail.options.lookupOptions.filterKey = 'sales-wip-rubric-category-by-rubric-filter';

			platformUIStandardExtentService.extend(service, salesCommonLookupConfigsService.getAdditionalGridColumnsFor(['projectfk', 'prcstructurefk']), salesWipHeaderDomainSchema);

			// re-use the layout configuration somewhere else (e.g. in the billing module)
			service.getLayoutDetailConfiguration = function getLayoutDetailConfiguration() {
				return _.cloneDeep(wipsForProjectDetailLayout);
			};

			service.getSalesWipEstLineItemLayout = getSalesWipEstLineItemLayout;

			return service;
		}
	]);
})();
