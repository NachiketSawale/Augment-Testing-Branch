/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'controlling.structure';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModuleName = 'basics.customize';
	var estimateMainModule = 'estimate.main';
	var constructionsystemModule = 'constructionsystem.main';
	var boqMainModule = 'boq.main';
	var estimateProjectModule = 'estimate.project';
	var estimateParameterModule = 'estimate.parameter';
	var estimateRuleModule = 'estimate.rule';
	var projectStructuresModule = 'project.structures';

	angular.module(moduleName).factory('controllingStructureLineItemLayout', ['$injector', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'platformModuleNavigationService','projectMainForCOStructureService',
		function ($injector, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, naviService,projectMainForCOStructureService) {
			let detailsOverload = {
					'grid': {
						'formatter': function (row, cell, value, columnDef, dataContext) {
							let formattedValue = $injector.get('basicsCommonStringFormatService').detail2CultureFormatter(row, cell, value, columnDef, dataContext);
							return formattedValue;
						},
						'grouping': {'generic': false}
					},
					'readonly': true
				},
				addColumns = [{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					grouping: true,
					width: 300,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				}];

			function getEstQtyRelConfig() {
				return angular.extend(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.estquantityrel', 'Description', {
					showIcon: true,
					required: true,
					showClearButton: false
				}), {required: true});
			}

			function getSelectedProjectId() {
				return projectMainForCOStructureService.getSelected() ? projectMainForCOStructureService.getSelected().Id : -1;
			}

			return {
				fid: 'controlling.structure.lineItem',
				version: '1.0.0',
				showGrouping: true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['mdccontrollingunitfk', 'code', 'descriptioninfo', 'estimationcode', 'estimationdescription', 'quantityunittarget',
							'quantitytotal', 'costunit', 'costunittarget', 'costtotal', 'hoursunit', 'hoursunittarget', 'hourstotal',
							'info', 'projectno', 'projectname', 'estassemblycode', 'basuomtargetfk', 'basuomfk', 'prjchangefk', 'prjchangestatusfk','budgetunit', 'budget',
							'budgetdifference', 'revenueunit', 'revenue', 'estlineitemstatusfk', 'margin1', 'margin2', 'assemblytype',
							'estlineitemfk', 'estcostriskfk', 'rule', 'param', 'quantitytargetdetail', 'quantitytarget', 'wqquantitytarget', 'wqquantitytargetdetail',
							'quantitydetail', 'quantity', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2',
							'quantityfactor3', 'quantityfactor4', 'productivityfactordetail', 'productivityfactor',
							'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2',
							'basecostunit', 'basecosttotal',
							'sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk',
							'boqitemfk', 'boqrootref', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk',
							'mdcassetmasterfk', 'prjlocationfk', 'lgmjobfk', 'boqwiccatfk', 'wicboqitemfk', 'wicboqheaderfk', 'boqsplitquantityfk',
							'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'commenttext', 'hint', 'cosmatchtext',
							'costexchangerate1', 'costexchangerate2', 'currency1fk', 'currency2fk', 'foreignbudget1', 'foreignbudget2',
							'dayworkrateunit', 'dayworkratetotal',
							'estqtyrelboqfk', 'estqtyrelactfk', 'estqtyrelgtufk', 'estqtytelaotfk',
							'islumpsum', 'isdisabled', 'isgc', 'isnomarkup', 'isfixedbudget', 'isoptional', 'isnoescalation', 'isincluded', 'noleadquantity', 'isfixedprice',
							'entcostunit', 'entcostunittarget', 'entcosttotal', 'enthoursunit', 'enthoursunittarget', 'enthourstotal',
							'drucostunit', 'drucostunittarget', 'drucosttotal', 'druhoursunit', 'druhoursunittarget', 'druhourstotal',
							'dircostunit', 'dircostunittarget', 'dircosttotal', 'dirhoursunit', 'dirhoursunittarget', 'dirhourstotal',
							'indcostunit', 'indcostunittarget', 'indcosttotal', 'indhoursunit', 'indhoursunittarget', 'indhourstotal',
							'markupcostunit', 'markupcostunittarget', 'markupcosttotal', 'grandcostunit', 'grandcostunittarget', 'grandtotal',
							'escalationcosttotal', 'escalationcostunit', 'riskcostunit', 'riskcosttotal',
							'prcstructurefk', 'cosinstancecode', 'cosinstancedescription',
							'cosmasterheadercode', 'cosmasterheaderdescription'
						]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'mdccontrollingunitfk': {
						'readonly': true,
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'est-prj-controlling-unit-filter',
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'controllingunit',
								displayMember: 'Code'
							}
						}
					},
					'code': {
						searchable: true,
						readonly: true,
						navigator: {
							moduleName: '',
							navFunc: function (item, triggerField) {
								var navigator = naviService.getNavigator('estimate.main-line-item');
								angular.extend(triggerField, {
									ProjectContextId: triggerField.ProjectFk
								});
								$injector.get('estimateMainService').unHookRequiresRefresh();
								naviService.navigate(navigator, item, triggerField);
							}
						},
					},
					'descriptioninfo': {
						readonly: true,
					},
					'estimationcode': {
						readonly: true,
						navigator: {
							moduleName: 'estimate.main'
						}
					},
					'estimationdescription': {
						readonly: true
					},
					'quantityunittarget': {'readonly': true},
					'quantitytotal': {'readonly': true},
					'costunit': {'readonly': true},
					'costunittarget': {'readonly': true},
					'costtotal': {'readonly': true},
					'hoursunit': {'readonly': true},
					'hoursunittarget': {'readonly': true},
					'hourstotal': {'readonly': true},
					'info': {
						'readonly': true,
						'detail': {
							visible: false
						},
						'grid': {
							field: 'image',
							formatter: 'image',
							formatterOptions: {
								imageSelector: 'estimateMainLineItemImageProcessor'
							}
						}
					},
					'projectno': {
						readonly: true
					},
					'projectname': {
						readonly: true
					},
					'estassemblycode': {
						searchable: true,
						readonly: true
					},
					'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						readonly: true
					}, {required: false}),
					'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						readonly: true
					}),
					'prjchangefk': {
						readonly: true,
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-change-dialog',
								lookupOptions: {
									'showClearButton': true,
									filterKey: 'estimate-main-project-change-common-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'projectchange',
								displayMember: 'Code'
							},
							width: 130
						}
					},
					'prjchangestatusfk': {
						'readonly': true,
						'grid': {
							field: 'PrjChangeFk',
							formatter: 'lookup',
							formatterOptions: {
								dataServiceName: 'controllingStructurePrjChangeStatusLookupService',
								displayMember: 'Description',
								imageSelector: 'platformStatusIconService'
							}
						}
					},
					'budget': {'grouping': {'generic': false}, readonly: true},
					'budgetdifference': {
						readonly: true
					},
					'budgetunit': {'grouping': {'generic': false}, readonly: true},
					'revenue': {'grouping': {'generic': false}, readonly: true},
					'revenueunit':{'grouping': {'generic': false}, readonly: true},
					'estlineitemstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.estlineitemstatus', 'Description', {
						showIcon: true
					}),
					'margin1': {'readonly': true, 'grouping': {'generic': false}},
					'margin2': {'readonly': true, 'grouping': {'generic': false}},
					'assemblytype': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						cacheEnable: true,
						moduleQualifier: 'estimateMainAssemblyTypeLookupDataService',
						dataServiceName: 'estimateMainAssemblyTypeLookupDataService',
						disableDataCaching: false,
						valMember: 'Type',
						dispMember: 'Description',
						columns: [
							{
								id: 'Description',
								field: 'Description',
								name: 'Description',
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription',
								sorting: 2,
								sortOrder: 2
							}
						],
						readonly: true
					}),
					'estlineitemfk': {
						readonly: true,
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estlineitems',
								displayMember: 'Code'
							}
						}
					},
					'estcostriskfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costrisk', 'Description', {
						showClearButton: true,
						grouping: {generic: true}
					}),
					'rule': {
						readonly: true,
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
						readonly: true,
						'grid': {
							isTransient: true,
							formatter: 'imageselect',
							formatterOptions: {
								dataServiceName: 'estimateParameterFormatterService',
								dataServiceMethod: 'getItemByParamAsync',
								itemServiceName: 'estimateMainService',
								itemName: 'EstLineItems',
								serviceName: 'estimateParameterFormatterService',
								acceptFalsyValues: true
							}
						}
					},
					'quantitytarget': {'readonly': true, 'grouping': {'generic': false}},
					'quantitytargetdetail': detailsOverload,
					'wqquantitytargetdetail': detailsOverload,
					'wqquantitytarget': {'readonly': true, 'grouping': {'generic': false}},

					'quantity': {'readonly': true, 'grouping': {'generic': false}},
					'quantitydetail': detailsOverload,
					'quantityfactordetail1': detailsOverload,
					'quantityfactordetail2': detailsOverload,
					'quantityfactor1': {'readonly': true, 'grouping': {'generic': false}},
					'quantityfactor2': {'readonly': true, 'grouping': {'generic': false}},
					'quantityfactor3': {'readonly': true, 'grouping': {'generic': false}},
					'quantityfactor4': {'readonly': true, 'grouping': {'generic': false}},
					'productivityfactor':{'readonly': true, 'grouping': {'generic': false}},
					'productivityfactordetail': detailsOverload,
					'costfactor1': {'readonly': true, 'grouping': {'generic': false}},
					'costfactor2': {'readonly': true, 'grouping': {'generic': false}},
					'costfactordetail1': detailsOverload,
					'costfactordetail2': detailsOverload,
					'basecostunit': {'readonly': true, 'grouping': {'generic': false}},
					'basecosttotal': {'readonly': true, 'grouping': {'generic': false}},
					'sortcode01fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode01LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode02fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode02LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode03fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode03LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode04fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode04LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode05fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode05LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode06fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode06LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode07fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode07LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode08fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode08LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode09fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode09LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'sortcode10fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectSortCode10LookupDataService',
						showClearButton: true,
						filter: function () {
							return getSelectedProjectId();
						},
						readonly: true
					},{readonly: true}),
					'boqitemfk': {
						'readonly': true,
						navigator: {
							moduleName: 'boq.main',
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estboqitems',
								displayMember: 'Reference',
								dataServiceName: 'estimateMainBoqLookupService'
							}
						}
					},
					'boqrootref': {
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
							editor: 'lookup',
							editorOptions: {
								directive: 'estimate-main-activity-dialog',
								lookupOptions: {
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': [{
										id: 'dec',
										field: 'Description',
										name: 'Description',
										width: 120,
										toolTip: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estlineitemactivity',
								displayMember: 'Code',
								dataServiceName: 'estimateMainActivityLookupService'
							}
						}
					},
					'prjlocationfk': {
						'readonly': true,
						navigator: {
							moduleName: 'project.main-location'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'estimate-main-location-dialog',
								lookupOptions: {
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estLineItemLocation',
								displayMember: 'Code',
								dataServiceName: 'estimateMainLocationLookupService'
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
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-mdc-work-category-dialog',
								'lookupOptions': {
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns
								}
							},
							'width': 150
						}
					},
					'mdcassetmasterfk': {
						'readonly': true,
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'AssertMaster',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-asset-master-dialog',
								'lookupOptions': {
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns
								}
							},
							'width': 150
						}
					},
					'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						'readonly': true,
						dataServiceName: 'logisticJobLookupByProjectDataService',
						cacheEnable: true,
						additionalColumns: false,
						filter: function () {
							return getSelectedProjectId();
						}
					}),
					'boqwiccatfk': {
						'readonly': true,
						'grouping': {'generic': true},
						'grid': {
							field: 'BoqWicCatFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'WicGroupFk',
								displayMember: 'Code',
								dataServiceName: 'boqWicGroupService'
							},
							'grouping': {'generic': true}
						}
					},
					'wicboqitemfk': {
						'readonly': true,
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'estimate-main-wic-item-lookup',
								lookupOptions: {
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Reference',
									'addGridColumns': [
										{
											id: 'brief',
											field: 'BriefInfo',
											name: 'Description',
											width: 120,
											toolTip: 'Brief',
											formatter: 'translation',
											name$tr$: 'estimate.main.briefInfo'
										}
									]
								}
							},
							field: 'WicBoqItemFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'wicboqitems',
								displayMember: 'Reference',
								dataServiceName: 'boqWicItemService'
							},
							'grouping': {'generic': true}
						}
					},
					'wicboqheaderfk': {
						'readonly': true,
						'grid': {
							field: 'WicBoqItemFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'wicboqheaderitems',
								displayMember: 'Reference',
								dataServiceName: 'estimateMainWicBoqRootItemLookupService'
							},
							'grouping': {'generic': true}
						}
					},
					'boqsplitquantityfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						'readonly': true,
						dataServiceName: 'basicsBoqSplitQuantityLookupDataService',
						'valMember': 'Id',
						'dispMember': 'SplitNo',
						filter: function (item) {
							var currentBoqItemAndBoqHeader = null;
							if (item) {
								currentBoqItemAndBoqHeader = {};
								currentBoqItemAndBoqHeader.BoqItemFk = item.BoqItemFk;
								currentBoqItemAndBoqHeader.BoqHeaderFk = item.BoqHeaderFk;
							}
							return currentBoqItemAndBoqHeader;
						},
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									var lookupItem = args.selectedItem;
									var item = args.entity;
									if (item && lookupItem) {
										item.BoqSplitQuantityFk = lookupItem.Id;
									}
								}
							}]
					}),
					'userdefined1': {
						'readonly': true,
						'grid': {
							'maxLength': 252
						}
					},
					'userdefined2': {
						'readonly': true,
						'grid': {
							'maxLength': 252
						}
					},
					'userdefined3': {
						'readonly': true,
						'grid': {
							'maxLength': 252
						}
					},
					'userdefined4': {
						'readonly': true,
						'grid': {
							'maxLength': 252
						}
					},
					'userdefined5': {
						'readonly': true,
						'grid': {
							'maxLength': 252
						}
					},
					'commenttext': {'readonly': true},
					'hint': {'readonly': true},
					'cosmatchtext': {readonly: true},
					'costexchangerate1': {
						'readonly': true,
						'grouping': {'generic': false}
					},
					'costexchangerate2': {
						'readonly': true,
						'grouping': {'generic': false}
					},
					'foreignbudget1': {'readonly': true, 'grouping': {'generic': true}},
					'foreignbudget2': {'readonly': true, 'grouping': {'generic': true}},
					'currency1fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true,
						readonly: true
					}),
					'currency2fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true,
						readonly: true
					}),
					'dayworkratetotal': {'readonly': true, 'grouping': {'generic': false}},
					'dayworkrateunit': {'readonly': true, 'grouping': {'generic': false}},

					'estqtyrelboqfk': getEstQtyRelConfig(),
					'estqtyrelactfk': getEstQtyRelConfig(),
					'estqtyrelgtufk': getEstQtyRelConfig(),
					'estqtytelaotfk': getEstQtyRelConfig(),
					'islumpsum': {readonly: true},
					'isdisabled': {readonly: true},
					'isgc': {readonly: true},
					'isnomarkup': {readonly: true},
					'isfixedbudget': {readonly: true},
					'isoptional': {readonly: true},
					'isnoescalation': {readonly: true},
					'isincluded': {readonly: true},
					'noleadquantity': {readonly: true},
					'isfixedprice': {readonly: true},
					'entcostunit': {'readonly': true, 'grouping': {'generic': false}},
					'entcostunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'entcosttotal': {'readonly': true, 'grouping': {'generic': false}},
					'enthoursunit': {'readonly': true, 'grouping': {'generic': false}},
					'enthoursunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'enthourstotal': {'readonly': true, 'grouping': {'generic': false}},
					'drucostunit': {'readonly': true, 'grouping': {'generic': false}},
					'drucostunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'drucosttotal': {'readonly': true, 'grouping': {'generic': false}},
					'druhoursunit': {'readonly': true, 'grouping': {'generic': false}},
					'druhoursunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'druhourstotal': {'readonly': true, 'grouping': {'generic': false}},
					'dircostunit': {'readonly': true, 'grouping': {'generic': false}},
					'dircostunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'dircosttotal': {'readonly': true, 'grouping': {'generic': false}},
					'dirhoursunit': {'readonly': true, 'grouping': {'generic': false}},
					'dirhoursunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'dirhourstotal': {'readonly': true, 'grouping': {'generic': false}},
					'indcostunit': {'readonly': true, 'grouping': {'generic': false}},
					'indcostunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'indcosttotal': {'readonly': true, 'grouping': {'generic': false}},
					'indhoursunit': {'readonly': true, 'grouping': {'generic': false}},
					'indhoursunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'indhourstotal': {'readonly': true, 'grouping': {'generic': false}},
					'markupcostunit': {'readonly': true, 'grouping': {'generic': false}},
					'markupcostunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'markupcosttotal': {'readonly': true, 'grouping': {'generic': false}},
					'grandcostunit': {'readonly': true, 'grouping': {'generic': false}},
					'grandcostunittarget': {'readonly': true, 'grouping': {'generic': false}},
					'grandtotal': {'readonly': true, 'grouping': {'generic': false}},
					'escalationcosttotal': {'readonly': true},
					'escalationcostunit': {'readonly': true},
					'riskcostunit': {'readonly': true},
					'riskcosttotal': {'readonly': true},
					'prcstructurefk': {
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog',
								'lookupOptions': {
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										width: 200,
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'Code'
							}
						},
						'readonly':true
					},
					'cosinstancecode': {
						readonly: true,
						navigator: {
							moduleName: 'constructionsystem.main'
						}
					},
					'cosmasterheaderdescription': {
						readonly: true
					},
					'cosmasterheadercode': {
						readonly: true,
						navigator: {
							moduleName: 'constructionsystem.master'
						}
					},
					'cosinstancedescription': {
						readonly: true
					},
					'fromdate': {
						'grid': {
							editor: 'dateutc',
							formatter: 'dateutc'
						},
						'readonly': true
					},
					'todate': {
						'grid': {
							editor: 'dateutc',
							formatter: 'dateutc'
						},
						'readonly': true
					},
					'formfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'estimateRuleUserformLookupService',
						enableCache: true,
						filter: function () {
							return 78; // Rubric 'Estimate' from [BAS_RUBRIC]
						},
						readonly: true
					},{readonly: true})
				},
				translationInfos: {
					extraModules: [cloudCommonModule,basicsCustomizeModuleName,estimateMainModule,constructionsystemModule,boqMainModule,estimateProjectModule,estimateParameterModule,estimateRuleModule,projectStructuresModule],
					extraWords: {
						Code: {location: estimateMainModule, identifier: 'Code', initial: 'Code'},
						EstimationCode: { location: estimateMainModule, identifier: 'entityEstimationHeader', initial: 'Estimate Code' },
						EstimationDescription: { location: estimateMainModule, identifier: 'entityEstimationDesc', initial: 'Estimate Desc.' },
						QuantityUnitTarget:{ location: estimateMainModule, identifier: 'quantityUnitTarget', initial: 'QuantityUnitTarget' },
						QuantityTotal:{ location: estimateMainModule, identifier: 'quantityTotal', initial: 'QuantityTotal' },
						CostUnit:{ location: estimateMainModule, identifier: 'costUnit', initial: 'CostUnit' },
						CostUnitTarget:{ location: estimateMainModule, identifier: 'costUnitTarget', initial: 'CostUnitTarget' },
						CostTotal:{ location: estimateMainModule, identifier: 'costTotal', initial: 'CostTotal' },
						HoursUnit:{ location: estimateMainModule, identifier: 'hoursUnit', initial: 'HoursUnit' },
						HoursUnitTarget:{ location: estimateMainModule, identifier: 'hoursUnitTarget', initial: 'HoursUnitTarget' },
						HoursTotal:{ location: estimateMainModule, identifier: 'hoursTotal', initial: 'HoursTotal' },
						Info:{ location: estimateMainModule, identifier: 'info', initial: 'Info' },
						ProjectNo: {location: estimateMainModule, identifier: 'projectNo', initial: 'Project-Number'},
						ProjectName: {location: estimateMainModule, identifier: 'projectName', initial: 'Project-Name'},
						EstAssemblyCode:{ location: estimateMainModule, identifier: 'estAssemblyFk', initial: 'Assembly Template' },
						BasUomTargetFk:{ location: estimateMainModule, identifier: 'basUomTargetFk', initial: 'UoM Target' },
						BasUomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
						PrjChangeFk : { location: estimateMainModule, identifier: 'prjChange', initial: 'Project Change'},
						BudgetUnit:{location: estimateMainModule, identifier: 'budgetUnit', initial: 'Budget/Unit'},
						RevenueUnit:{location: estimateMainModule, identifier: 'revenueUnit', initial: 'Revenue/Unit'},
						Revenue:{location: estimateMainModule, identifier: 'revenue', initial: 'Revenue'},
						EstLineItemStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
						Margin1 :{location: estimateMainModule, identifier : 'margin1', initial:'Margin1(Revenue-CostTotal)'},
						Margin2 :{location: estimateMainModule, identifier : 'margin2', initial:'Margin2(Revenue-GrandTotal)'},
						AssemblyType :{ location: estimateMainModule, identifier: 'assemblyType', initial: 'Assembly Type' },

						BaseCostTotal: {location: estimateMainModule, identifier: 'baseCostTotal', initial: 'Base Cost Total'},
						BaseCostUnit: {location: estimateMainModule, identifier: 'baseCostUnit', initial: 'Base Cost/Unit'},
						BoqItemFk: {location: estimateMainModule, identifier: 'boqItemFk', initial: 'BoqItem'},
						BoqRootRef: {location: estimateMainModule, identifier: 'boqRootRef', initial: 'BoQ Root Item Ref. No'},
						BoqSplitQuantityFk: {location: estimateMainModule, identifier: 'boqSplitQuantity', initial: 'Boq Split Quantity'},
						BoqWicCatFk: {location: estimateMainModule, identifier: 'boqWicCatFk', initial: 'WIC Group Ref.No'},

						CosInstanceCode: {location: estimateMainModule, identifier: 'cosInstanceCode', initial: 'COS Instance C'},
						CosInstanceDescription: {location: estimateMainModule, identifier: 'cosInstanceDescription', initial: 'COS Instance Desc'},
						CosMasterHeaderCode: {location: constructionsystemModule, identifier: 'masterHeaderCode', initial: 'Master Header Code'},
						CosMasterHeaderDescription: {location: constructionsystemModule, identifier: 'masterHeaderDescription', initial: 'Master Header Description'},
						CosMatchText: {location: estimateMainModule, identifier: 'cosMatchText', initial: 'COS Match Text'},
						CostExchangeRate1: {location: estimateMainModule, identifier: 'costExchangeRate1', initial: 'Cost Foreign Total 1'},
						CostExchangeRate2: {location: estimateMainModule, identifier: 'costExchangeRate2', initial: 'Cost Foreign Total 2'},
						CostFactor1: {location: estimateMainModule, identifier: 'costFactor1', initial: 'CostFactor1'},
						CostFactor2: {location: estimateMainModule, identifier: 'costFactor2', initial: 'CostFactor2'},
						CostFactorDetail1: {location: estimateMainModule, identifier: 'costFactorDetail1', initial: 'CostFactorDetail1'},
						CostFactorDetail2: {location: estimateMainModule, identifier: 'costFactorDetail2', initial: 'CostFactorDetail2'},

						Currency1Fk: {location: estimateMainModule, identifier: 'currency1Fk', initial: 'Foreign Currency 1'},
						Currency2Fk: {location: estimateMainModule, identifier: 'currency2Fk', initial: 'Foreign Currency 2'},
						DayWorkRateTotal: {location: estimateMainModule, identifier: 'dayWorkRateTotal', initial: 'DW/T+M Rate Total'},
						DayWorkRateUnit: {location: estimateMainModule, identifier: 'dayWorkRateUnit', initial: 'DW/T+M Rate/Unit'},
						DirCostTotal: {location: estimateMainModule, identifier: 'dirCostTotal', initial: 'Dir CostTotal'},
						DirCostUnit: {location: estimateMainModule, identifier: 'dirCostUnit', initial: 'Dir CostUnit'},
						DirCostUnitTarget: {location: estimateMainModule, identifier: 'dirCostUnitTarget', initial: 'Dir CostUnitTarget'},
						DirHoursTotal: {location: estimateMainModule, identifier: 'dirHoursTotal', initial: 'DirHoursTotal'},
						DirHoursUnit: {location: estimateMainModule, identifier: 'dirHoursUnit', initial: 'Dir HoursUnit'},
						DirHoursUnitTarget: {location: estimateMainModule, identifier: 'dirHoursUnitTarget', initial: 'DirHoursUnitTarget'},
						DruCostTotal: {location: estimateMainModule, identifier: 'druCostTotal', initial: 'Dru CostTotal'},
						DruCostUnit: {location: estimateMainModule, identifier: 'druCostUnit', initial: 'Dru CostUnit'},
						DruCostUnitTarget: {location: estimateMainModule, identifier: 'druCostUnitTarget', initial: 'Dru CostUnitTarget'},
						DruHoursTotal: {location: estimateMainModule, identifier: 'druHoursTotal', initial: 'DruHoursTotal'},
						DruHoursUnit: {location: estimateMainModule, identifier: 'druHoursUnit', initial: 'Dru HoursUnit'},
						DruHoursUnitTarget: {location: estimateMainModule, identifier: 'druHoursUnitTarget', initial: 'DruHoursUnitTarget'},
						EntCostTotal: {location: estimateMainModule, identifier: 'entCostTotal', initial: 'Ent CostTotal'},
						EntCostUnit: {location: estimateMainModule, identifier: 'entCostUnit', initial: 'Ent CostUnit'},
						EntCostUnitTarget: {location: estimateMainModule, identifier: 'entCostUnitTarget', initial: 'Ent CostUnitTarget'},
						EntHoursTotal: {location: estimateMainModule, identifier: 'entHoursTotal', initial: 'EntHoursTotal'},
						EntHoursUnit: {location: estimateMainModule, identifier: 'entHoursUnit', initial: 'Ent HoursUnit'},
						EntHoursUnitTarget: {location: estimateMainModule, identifier: 'entHoursUnitTarget', initial: 'EntHoursUnitTarget'},
						EscalationCostTotal: {location: estimateMainModule, identifier: 'escalationCostTotal', initial: 'Escalation Cost Total'},
						EscalationCostUnit: {location: estimateMainModule, identifier: 'escalationCostUnit', initial: 'Escalation Cost/Unit'},

						EstCostRiskFk: {location: estimateMainModule, identifier: 'estCostRiskFk', initial: 'estCostRisk'},
						EstLineItemFk: {location: estimateMainModule, identifier: 'estLineItemFk', initial: 'Line Item Ref.'},

						EstQtyRelActFk: {location: estimateMainModule, identifier: 'estQtyRelAct', initial: 'Act Qty Relation'},
						EstQtyRelBoqFk: {location: estimateMainModule, identifier: 'estQtyRelBoq', initial: 'Boq Qty Relation'},
						EstQtyRelGtuFk: {location: estimateMainModule, identifier: 'estQtyRelGtu', initial: 'Ctu Qty Relation'},
						EstQtyTelAotFk: {location: estimateMainModule, identifier: 'estQtyRelAot', initial: 'Aot Qty Relation'},

						ForeignBudget1: {location: estimateMainModule, identifier: 'foreignBudget1', initial: 'Foreign Budget 1'},
						ForeignBudget2: {location: estimateMainModule, identifier: 'foreignBudget2', initial: 'Foreign Budget 2'},
						FormFk: {location: estimateMainModule, identifier: 'formFk', initial: 'User Form'},
						FromDate: {location: estimateMainModule, identifier: 'fromDate', initial: 'From Date'},
						GrandCostUnit: {location: estimateMainModule, identifier: 'grandCostUnit', initial: 'Grand Cost/Unit'},
						GrandCostUnitTarget: {location: estimateMainModule, identifier: 'grandCostUnitTarget', initial: 'Grand Cost/Unit Item'},
						GrandTotal: {location: estimateMainModule, identifier: 'grandTotal', initial: 'Grand Total'},
						Hint: {location: estimateMainModule, identifier: 'hint', initial: 'Copy Source'},

						IndCostTotal: {location: estimateMainModule, identifier: 'indCostTotal', initial: 'Ind CostTotal'},
						IndCostUnit: {location: estimateMainModule, identifier: 'indCostUnit', initial: 'Ind CostUnit'},
						IndCostUnitTarget: {location: estimateMainModule, identifier: 'indCostUnitTarget', initial: 'Ind CostUnitTarget'},
						IndHoursTotal: {location: estimateMainModule, identifier: 'indHoursTotal', initial: 'IndHoursTotal'},
						IndHoursUnit: {location: estimateMainModule, identifier: 'indHoursUnit', initial: 'Ind HoursUnit'},
						IndHoursUnitTarget: {location: estimateMainModule, identifier: 'indHoursUnitTarget', initial: 'IndHoursUnitTarget'},

						InsertedAt: {location: cloudCommonModule, identifier: 'entityInsertedAt', initial: 'Inserted At'},
						InsertedBy: {location: cloudCommonModule, identifier: 'entityInsertedBy', initial: 'Inserted By'},
						IsDisabled: {location: estimateMainModule, identifier: 'isDisabled', initial: 'IsDisabled'},

						IsFixedPrice: {location: boqMainModule, identifier: 'IsFixedPrice', initial: 'Fixed Price'},
						IsGc: {location: estimateMainModule, identifier: 'isGc', initial: 'General Cost'},
						IsIncluded: {location: estimateMainModule, identifier: 'isIncluded', initial: 'Included'},
						IsLumpsum: {location: estimateMainModule, identifier: 'isLumpSum', initial: 'IsLumpSum'},
						IsNoEscalation: {location: estimateMainModule, identifier: 'isNoEscalation', initial: 'No Escalation'},
						IsNoMarkup: {location: estimateMainModule, identifier: 'isNoMarkup', initial: 'No Markup'},
						IsOptional: {location: estimateMainModule, identifier: 'estIsOptional', initial: 'Optional'},
						LgmJobFk: {location: estimateProjectModule, identifier: 'lgmJobFk', initial: 'Job'},

						MarkupCostTotal: {location: estimateMainModule, identifier: 'markupCostTotal', initial: 'Markup Cost Total'},
						MarkupCostUnit: {location: estimateMainModule, identifier: 'markupCostUnit', initial: 'Markup Cost/Unit'},
						MarkupCostUnitTarget: {location: estimateMainModule, identifier: 'markupCostUnitTarget', initial: 'Markup Cost/Unit Item'},
						MdcAssetMasterFk: {location: estimateMainModule, identifier: 'mdcAssetMasterFk', initial: 'MdcAssetMaster'},

						MdcWorkCategoryFk: {location: estimateMainModule, identifier: 'mdcWorkCategoryFk', initial: 'MdcWorkCategory'},
						NoLeadQuantity: {location: estimateMainModule, identifier: 'noLeadQuantity', initial: 'No Lead Quantity'},
						Param: {location: estimateParameterModule, identifier: 'params', initial: 'Params'},
						PrcPackage2HeaderFk: {location: estimateMainModule, identifier: 'prcPackage2HeaderFk', initial: 'PrcPackage2HeaderFk'},
						PrcPackageFk: {location: estimateMainModule, identifier: 'prcPackageFk', initial: 'PrcPackage'},
						PrcPackageStatusFk: {location: basicsCustomizeModuleName, identifier: 'packagestatus', initial: 'Package Status'},
						PrcStructureFk: {location: estimateMainModule, identifier: 'prcStructureFk', initial: 'PrcStructure'},

						PrjLocationFk: {location: estimateMainModule, identifier: 'prjLocationFk', initial: 'PrjLocation'},
						ProductivityFactor: {location: estimateMainModule, identifier: 'productivityFactor', initial: 'ProductivityFactor'},
						ProductivityFactorDetail: {location: estimateMainModule, identifier: 'productivityFactorDetail', initial: 'ProductivityFactorDetail'},

						PsdActivityFk: {location: estimateMainModule, identifier: 'psdActivityFk', initial: 'PsdActivity'},
						PsdActivitySchedule: {location: estimateMainModule, identifier: 'activitySchedule', initial: 'Activity Schedule'},

						QuantityDetail: {location: estimateMainModule, identifier: 'quantityDetail', initial: 'Quantity Detail'},
						QuantityFactor1: {location: estimateMainModule, identifier: 'quantityFactor1', initial: 'QuantityFactor1'},
						QuantityFactor2: {location: estimateMainModule, identifier: 'quantityFactor2', initial: 'QuantityFactor2'},
						QuantityFactor3: {location: estimateMainModule, identifier: 'quantityFactor3', initial: 'QuantityFactor3'},
						QuantityFactor4: {location: estimateMainModule, identifier: 'quantityFactor4', initial: 'QuantityFactor4'},
						QuantityFactorDetail1: {location: estimateMainModule, identifier: 'quantityFactorDetail1', initial: 'QuantityFactorDetail1'},
						QuantityFactorDetail2: {location: estimateMainModule, identifier: 'quantityFactorDetail2', initial: 'QuantityFactorDetail2'},
						QuantityTarget: {location: estimateMainModule, identifier: 'aqQuantityTarget', initial: 'AQ Quantity Item'},
						QuantityTargetDetail: {location: estimateMainModule, identifier: 'aqQuantityTargetDetail', initial: 'AQ Quantity Target Detail'},

						RiskCostTotal: {location: estimateMainModule, identifier: 'costRiskTotal', initial: 'Risk Cost Total'},
						RiskCostUnit: {location: estimateMainModule, identifier: 'costRiskUnit', initial: 'Risk Cost/Unit'},
						Rule: {location: estimateRuleModule, identifier: 'rules', initial: 'Rules'},
						SortCode01Fk: {location: projectStructuresModule, identifier: 'sortCode01', initial: 'Sort Code 1'},
						SortCode02Fk: {location: projectStructuresModule, identifier: 'sortCode02', initial: 'Sort Code 2'},
						SortCode03Fk: {location: projectStructuresModule, identifier: 'sortCode03', initial: 'Sort Code 3'},
						SortCode04Fk: {location: projectStructuresModule, identifier: 'sortCode04', initial: 'Sort Code 4'},
						SortCode05Fk: {location: projectStructuresModule, identifier: 'sortCode05', initial: 'Sort Code 5'},
						SortCode06Fk: {location: projectStructuresModule, identifier: 'sortCode06', initial: 'Sort Code 6'},
						SortCode07Fk: {location: projectStructuresModule, identifier: 'sortCode07', initial: 'Sort Code 7'},
						SortCode08Fk: {location: projectStructuresModule, identifier: 'sortCode08', initial: 'Sort Code 8'},
						SortCode09Fk: {location: projectStructuresModule, identifier: 'sortCode09', initial: 'Sort Code 9'},
						SortCode10Fk: {location: projectStructuresModule, identifier: 'sortCode10', initial: 'Sort Code 10'},
						SortDesc01Fk: {location: projectStructuresModule, identifier: 'sortDesc01', initial: 'Sort Description 1'},
						SortDesc02Fk: {location: projectStructuresModule, identifier: 'sortDesc02', initial: 'Sort Description 2'},
						SortDesc03Fk: {location: projectStructuresModule, identifier: 'sortDesc03', initial: 'Sort Description 3'},
						SortDesc04Fk: {location: projectStructuresModule, identifier: 'sortDesc04', initial: 'Sort Description 4'},
						SortDesc05Fk: {location: projectStructuresModule, identifier: 'sortDesc05', initial: 'Sort Description 5'},
						SortDesc06Fk: {location: projectStructuresModule, identifier: 'sortDesc06', initial: 'Sort Description 6'},
						SortDesc07Fk: {location: projectStructuresModule, identifier: 'sortDesc07', initial: 'Sort Description 7'},
						SortDesc08Fk: {location: projectStructuresModule, identifier: 'sortDesc08', initial: 'Sort Description 8'},
						SortDesc09Fk: {location: projectStructuresModule, identifier: 'sortDesc09', initial: 'Sort Description 9'},
						SortDesc10Fk: {location: projectStructuresModule, identifier: 'sortDesc10', initial: 'Sort Description 10'},
						ToDate: {location: estimateMainModule, identifier: 'toDate', initial: 'To Date'},
						WicBoqHeaderFk: {location: estimateMainModule, identifier: 'wicBoqHeaderFk', initial: 'WIC BoQ -Root Item ref.No'},
						WicBoqItemFk: {location: estimateMainModule, identifier: 'wicBoqItemFk', initial: 'WIC BoQ -Item Ref.No'},
						WqQuantityTarget: {location: estimateMainModule, identifier: 'wqQuantityTarget', initial: ' Wq Quantity Item'},
						WqQuantityTargetDetail: {location: estimateMainModule, identifier: 'wqQuantityTargetDetail', initial: 'Wq Quantity Target Detail'},
						PrjChangeStatusFk : { location: estimateMainModule, identifier: 'prjChangeStatus', initial: 'Project Change Status'}
					}
				}
			};
		}]);

	angular.module(moduleName).factory('controllingStructureLineItemUIStandardService',
		['controllingStructureLineItemLayout', 'estimateMainUIConfigurationService', 'platformUIStandardConfigService', 'platformSchemaService', 'controllingStructureTranslationService',
			function (controllingStructureLineItemLayout, estimateMainUIConfigurationService, platformUIStandardConfigService, platformSchemaService, translationService) {

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'EstLineItemDto',
						moduleSubModule: 'Estimate.Main'
					});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
					domainSchema.Info ={ domain : 'image'};
					domainSchema.Rule ={ domain : 'imageselect'};
					domainSchema.Param ={ domain : 'imageselect'};
					domainSchema.BoqRootRef ={ domain : 'integer'};
					domainSchema.PsdActivitySchedule ={ domain : 'code'};
					domainSchema.CostExchangeRate1 = {domain: 'money'};
					domainSchema.CostExchangeRate2 = {domain: 'money'};
					domainSchema.Currency1Fk = {domain: 'integer'};
					domainSchema.Currency2Fk = {domain: 'integer'};
					domainSchema.ExchangeRate1 = {domain: 'integer'};
					domainSchema.ExchangeRate2 = {domain: 'integer'};
					domainSchema.EscalationCostTotal = {domain: 'money'};
					domainSchema.EscalationCostUnit = {domain: 'money'};
					domainSchema.RiskCostUnit = {domain: 'money'};
					domainSchema.RiskCostTotal = {domain: 'money'};
					domainSchema.EstAssemblyCode = {domain: 'code'};
					domainSchema.PrjChangeStatusFk = {
						domain: 'integer',
						groupings: [{groupcolid: 'Change.Main.ChangeStatus', mappinghint: 'prjchangestatusfk'}]
					};

					if (domainSchema.ProjectNo) {
						domainSchema.ProjectNo.grouping = 'Estimate.Main.ProjectNo';
					}
					if (domainSchema.ProjectName) {
						domainSchema.ProjectName.grouping = 'Estimate.Main.ProjectName';
					}

					if (domainSchema.CosInstanceCode) {
						domainSchema.CosInstanceCode.grouping = 'Estimate.Main.CosInstance';
					}
					if (domainSchema.CosInstanceDescription) {
						domainSchema.CosInstanceDescription.grouping = 'Estimate.Main.CosInstance';
					}
				}

				function UIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new UIStandardService(controllingStructureLineItemLayout, domainSchema, translationService);
				return service;
			}]);
})();