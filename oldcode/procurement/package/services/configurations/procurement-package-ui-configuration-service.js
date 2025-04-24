/**
 * Created by zos on 3/6/2017.
 */
(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	'use strict';
	var moduleName = 'procurement.package';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPackageUIConfigurationService',
		['basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'procurementPackageDataService', '$translate', '$injector',
			'platformModuleNavigationService', '$http',
			function (basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, procurementPackageDataService, $translate, $injector,
				naviService, $http) {

				function getSelectedProjectId() {
					return procurementPackageDataService.getSelected() ?
						procurementPackageDataService.getSelected().ProjectFk : -1;
				}

				var detailsOverload = {
						'readonly': true,
						'grid': {
							formatter: function (row, cell, value) {
								return _.toUpper(value);
							}
						}
					},
					addColumns = [{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 300,
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}],
					getEstQtyRel = {
						'readonly': true,
						'grid': {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'basicsEstimateQuantityRelationIconService'
							}
						}
					};

				function getProjectChangeLookupOptions() {
					return {
						showClearButton: true,
						createOptions: {
							typeOptions: {
								isProcurement: true,
								isChangeOrder: true
							}
						},
						filterOptions: {
							serverKey: 'project-change-lookup-for-procurement-common-filter',
							serverSide: true,
							fn: function () {
								return {
									ProjectFk: procurementPackageDataService.getSelected() ?
										procurementPackageDataService.getSelected().ProjectFk : 0,
									IsProcurement : true
								};
							}
						}
					};
				}

				return {
					getPackageEstLineItemLayout: function () {
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
										'basuomtargetfk', 'quantitydetail', 'quantity', 'basuomfk', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
										'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal', 'costunit', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costunittarget',
										'costtotal', 'hoursunit', 'hoursunittarget', 'hourstotal', 'estcostriskfk', 'mdccontrollingunitfk', 'boqrootref', 'boqitemfk', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk',
										'mdcassetmasterfk', 'prjlocationfk', 'prcstructurefk', 'estqtyrelboqfk', 'estqtyrelactfk', 'estqtyrelgtufk', 'estqtytelaotfk', 'prjchangefk', 'islumpsum', 'isdisabled', 'isgc', 'commenttext',
										'entcostunit', 'entcostunittarget', 'entcosttotal', 'enthoursunit', 'enthoursunittarget', 'enthourstotal',
										'drucostunit', 'drucostunittarget', 'drucosttotal', 'druhoursunit', 'druhoursunittarget', 'druhourstotal',
										'dircostunit', 'dircostunittarget', 'dircosttotal', 'dirhoursunit', 'dirhoursunittarget', 'dirhourstotal',
										'indcostunit', 'indcostunittarget', 'indcosttotal', 'indhoursunit', 'indhoursunittarget', 'indhourstotal',
										'cosinstancecode', 'cosinstancedescription', 'cosmasterheadercode', 'cosmasterheaderdescription', 'fromdate', 'todate',
										'sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk', 'packageassignments','co2sourcetotal','co2projecttotal','co2totalvariance','grandtotal','externalcode']
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

							'overloads': {
								statusoflineitemassignedtopackage: {
									readonly: true,
									grid: {
										field: 'statusImage',
										formatter: 'image',
										formatterOptions: {
											imageSelector: 'procurementPackageStatusOfLineItemAssignedToPackageProcessor',
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
											var packageService = $injector.get('procurementPackageDataService');
											var projectId = packageService.getSelected().ProjectFk;

											angular.extend(triggerField, {
												ProjectContextId: projectId
											});
											let estimateMainService = $injector.get('estimateMainService');
											if (estimateMainService && _.isFunction(estimateMainService.unHookRequiresRefresh)) {
												estimateMainService.unHookRequiresRefresh();
											}
											naviService.navigate(navigator, item, triggerField);
										}
									},
									'readonly': true
								},

								// TODO, this changes according to Estimate.Main
								'estlineitemfk': {
									'readonly': true,
									'grid': {
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'estlineitems',
											displayMember: 'Code',
											// dataServiceName: 'estimateMainLineItemDialogService'
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
										return getSelectedProjectId();
									}
								}),
								'sortcode02fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode02LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode03fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode03LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode04fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode04LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode05fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode05LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode06fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode06LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode07fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode07LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode08fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode08LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode09fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode09LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'sortcode10fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'projectSortCode10LookupDataService',
									showClearButton: true,
									filter: function () {
										return getSelectedProjectId();
									}
								}),
								'packageassignments': {
									'readonly':true,
									'width': 200
								},
								'co2sourcetotal':{'readonly': true},
								'co2projecttotal':{'readonly': true}
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
					},

					getPackageEstResourceLayout: function () {
						return {
							'fid': 'estimate.main.resource.detailform',
							'version': '1.0.0',
							'showGrouping': true,
							'change': 'change',
							'addValidationAutomatically': true,
							'groups': [
								{
									'gid': 'basicData',
									'attributes': ['estresourcetypefkextend', 'code', 'descriptioninfo', 'descriptioninfo1', 'basuomfk', 'bascurrencyfk', 'estcosttypefk', 'estresourceflagfk', 'sorting', 'budgetunit', 'budget', 'lgmjobfk', 'budgetdifference','externalcode']
								},
								{
									'gid': 'ruleInfo',
									'attributes': ['ruletype', 'rulecode', 'ruledescription', 'evalsequencefk', 'elementcode', 'elementdescription']
								},
								{
									'gid': 'quantiyAndFactors',
									'attributes': ['quantitydetail', 'quantity', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2',
										'quantityfactor3', 'quantityfactor4', 'productivityfactordetail', 'productivityfactor', 'efficiencyfactordetail1', 'efficiencyfactor1',
										'efficiencyfactordetail2', 'efficiencyfactor2', 'quantityfactorcc', 'quantityreal', 'quantityinternal', 'quantityunittarget', 'quantitytotal', 'quantityoriginal','co2source', 'co2sourcetotal', 'co2project', 'co2projecttotal']
								},
								{
									'gid': 'costFactors',
									'attributes': ['costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costfactorcc']
								},
								{
									'gid': 'costAndHours',
									'attributes': ['costunit', 'costunitsubitem', 'costunitlineitem', 'costunittarget', 'costunitoriginal', 'costtotal', 'hoursunit', 'hourfactor', 'hoursunitsubitem', 'hoursunitlineitem',
										'hoursunittarget', 'hourstotal']
								},
								{
									'gid': 'flags',
									'attributes': ['islumpsum', 'isdisabled', 'isindirectcost', 'isdisabledprc', 'isgeneratedprc', 'isfixedbudget']
								},
								{
									'gid': 'package',
									'attributes': ['packageassignments', 'prcstructurefk']
								},
								{
									'gid': 'comment',
									'attributes': ['commenttext']
								},
								{
									'gid': 'entityHistory',
									'isHistory': true
								}
							],

							'overloads': {
								'externalcode': {
									'readonly': true,
									'detail': {
										visible: true
									},
									'grid': {
										field: 'ExternalCode',
										'formatter': function (row, cell, value) {
											const packageEstimateLineItemDataService = $injector.get('procurementPackageEstimateLineItemDataService');
											const lineItem = packageEstimateLineItemDataService.getSelected();
											if(lineItem){
												return lineItem.ExternalCode;
											}else {
												return value;
											}
										}
									}
								},
								'code': {
									'detail': {
										type: 'directive',
										directive: 'estimate-main-resource-code-lookup',
										options: {
											showClearButton: true,
											lookupField: 'Code',
											gridOptions: {
												multiSelect: false
											},
											isTextEditable: false,
											grid: false
										}
									},
									'grid': {
										editor: 'directive',
										editorOptions: {
											showClearButton: true,
											directive: 'estimate-main-resource-code-lookup',
											lookupField: 'Code',
											gridOptions: {
												multiSelect: true
											},
											isTextEditable: false,
											grid: true
										}
									}
								},
								'descriptioninfo': {
									'detail': {
										type: 'directive',
										directive: 'estimate-main-resource-code-lookup',
										options: {
											showClearButton: true,
											lookupField: 'DescriptionInfo.Translated',
											gridOptions: {
												multiSelect: false
											},
											DisplayMember: 'DescriptionInfo.Translated',
											isTextEditable: false,
											grid: false
										},
										editor: 'directive',
										editorOptions: {
											showClearButton: true,
											directive: 'estimate-main-resource-code-lookup',
											lookupField: 'DescriptionInfo.Translated',
											gridOptions: {
												multiSelect: true
											},
											isTextEditable: false,
											grid: true
										},
										bulkSupport: false
									},
									'grid': {
										editor: 'directive',
										editorOptions: {
											showClearButton: true,
											directive: 'estimate-main-resource-code-lookup',
											lookupField: 'DescriptionInfo.Translated',
											gridOptions: {
												multiSelect: true
											},
											isTextEditable: false,
											grid: true
										},
										bulkSupport: false
									}
								},
								'descriptioninfo1': {
									maxLength: 255
								},
								'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'logisticJobLookupByProjectDataService',
									cacheEnable: true,
									additionalColumns: false,
									filter: function () {
										return $injector.get('estimateMainService').getSelectedProjectId();

									}
								}),
								'hourfactor': {'readonly': true},
								'quantitydetail': detailsOverload,
								'quantityfactordetail1': detailsOverload,
								'quantityfactordetail2': detailsOverload,
								'productivityfactordetail': detailsOverload,
								'costfactordetail1': detailsOverload,
								'costfactordetail2': detailsOverload,
								'efficiencyfactordetail1': detailsOverload,
								'efficiencyfactordetail2': detailsOverload,
								'quantityunittarget': {'readonly': true},
								'quantitytotal': {'readonly': true},
								'quantityoriginal': {'readonly': true},
								'costunittarget': {'readonly': true},
								'costunitoriginal': {'readonly': true},
								'costtotal': {'readonly': true},
								'hoursunit': {'readonly': true},
								'hoursunittarget': {'readonly': true},
								'hoursunitsubitem': {'readonly': true},
								'hoursunitlineitem': {'readonly': true},
								'hourstotal': {'readonly': true},
								'quantityfactorcc': {'readonly': true},
								'costfactorcc': {'readonly': true},
								'quantityreal': {'readonly': true},
								'quantityinternal': {'readonly': true},
								'costunitsubitem': {'readonly': true},
								'costunitlineitem': {'readonly': true},
								'ruletype': {'readonly': true},
								'rulecode': {'readonly': true},
								'ruledescription': {'readonly': true},
								'elementcode': {'readonly': true},
								'elementdescription': {'readonly': true},
								'costunit': {
									'formatter': function (row, cell, value, columnDef, dataContext) {
										var formattedValue = '';
										formattedValue = $injector.get('platformGridDomainService').formatter('money')(0, 0, value, {});
										var isActivate = $injector.get('estimateMainCommonService').getActivateEstIndicator();
										if (isActivate && dataContext.CostUnitOriginal !== undefined && dataContext.CostUnit !== dataContext.CostUnitOriginal) {
											formattedValue = '<div class="text-right" style="color:red;">' + formattedValue + '</div>';
										} else {
											formattedValue = '<div class="text-right">' + formattedValue + '</div>';
										}
										return formattedValue;
									}
								},
								'quantity': {
									'formatter': function (row, cell, value, columnDef, dataContext) {
										var formattedValue = '';
										formattedValue = $injector.get('platformGridDomainService').formatter('quantity')(0, 0, value, {});
										var isActivate = $injector.get('estimateMainCommonService').getActivateEstIndicator();
										if (isActivate && dataContext.QuantityOriginal !== undefined && dataContext.Quantity !== dataContext.QuantityOriginal) {
											formattedValue = '<div class="text-right" style="color:red;">' + formattedValue + '</div>';
										} else {
											formattedValue = '<div class="text-right">' + formattedValue + '</div>';
										}
										return formattedValue;
									}
								},
								// removed read-only attribute by defect #82470
								// 'quantityfactor1': {'readonly': true},
								// 'quantityfactor2': {'readonly': true},
								// 'quantityfactor3': {'readonly': true},
								// 'quantityfactor4': {'readonly': true},
								// 'costfactor1': {'readonly': true},
								// 'costfactor2': {'readonly': true},
								// 'productivityfactor': {'readonly': true},
								// 'efficiencyfactor1': {'readonly': true},
								// 'efficiencyfactor2': {'readonly': true},

								'evalsequencefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.evaluationSequence', 'Description'),
								'estresourcetypefkextend': {
									'grid': {
										editor: 'directive',
										editorOptions: {
											directive: 'estimate-main-resource-type-lookup',
											lookupOptions: {
												'showClearButton': true,
												'additionalColumns': true,
												'displayMember': 'ShortKeyInfo.Translated',
												'addGridColumns': [
													{
														id: 'brief',
														field: 'DescriptionInfo',
														name: 'Description',
														width: 120,
														formatter: 'translation',
														name$tr$: 'estimate.main.resourceShortKey'
													}
												]
											}
										},
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'resourcetype',
											displayMember: 'ShortKeyInfo.Translated',
											dataServiceName: 'estimateMainResourceTypeLookupService'
										}
									},
									'detail': {
										'type': 'directive',
										'directive': 'estimate-main-resource-type-lookup',
										'options': {
											'lookupDirective': 'estimate-main-resource-type-lookup',
											'descriptionField': 'ShortKeyInfo',
											'descriptionMember': 'ShortKeyInfo.Translated',
											'lookupOptions': {
												'initValueField': 'ShortKeyInfo'
											}
										}
									}
								},

								'bascurrencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'basicsCurrencyLookupDataService',
									enableCache: true,
									readonly: true
								}),

								'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'basicsUnitLookupDataService',
									cacheEnable: true
								}, {required: false}),
								'prcstructurefk': {
									'readonly': true,
									'grid': {
										'editor': 'lookup',
										'editorOptions': {
											'directive': 'basics-procurementstructure-structure-dialog',
											'lookupOptions': {
												'additionalColumns': true,
												'displayMember': 'Code',
												'addGridColumns': addColumns
											}
										},
										'formatter': 'lookup',
										'formatterOptions': {
											'lookupType': 'prcstructure',
											'displayMember': 'Code'
										}
									},
									'detail': {
										'type': 'directive',
										'directive': 'basics-lookupdata-lookup-composite',
										'options': {
											'lookupDirective': 'basics-procurementstructure-structure-dialog',
											'descriptionField': 'StructureDescription',
											'descriptionMember': 'DescriptionInfo.Translated',
											'lookupOptions': {
												'initValueField': 'StructureCode',
												'showClearButton': true
											}
										}
									}
								},
								'estcosttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description'),

								'estresourceflagfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.resourceflag', 'Description'),
								'packageassignments': {
									'readonly':true,
									'width': 200
								},
								'co2source': {'readonly': true},
								'co2project': {'readonly': true},
								'co2sourcetotal':{'readonly': true},
								'co2projecttotal':{'readonly': true}
							}
						};
					},

					getPackageEstHeaderLayout: function () {
						return {
							'fid': 'package.detail',
							'version': '1.0.0',
							'addValidationAutomatically': true,
							'showGrouping': true,
							'groups': [
								{
									'gid': 'HeaderGroupHeader',
									'attributes': ['eststatusfk', 'code', 'descriptioninfo', 'mdclineitemcontextfk', 'bascurrencyfk']
								},
								{'gid': 'entityHistory', 'isHistory': true}
							],
							'overloads': {
								'eststatusfk': {
									'readonly': true,
									'grid': {
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'eststatus',
											displayMember: 'Description'
										}
									}
								},
								'code': {
									'readonly': true,
									'navigator': {
										'moduleName': 'procurement.package.estimateHeaderGridControllerTitle',
										'navFunc': function (item, triggerField) {
											var projectId = $injector.get('procurementPackageDataService').getSelected().ProjectFk;

											var navProject = $injector.get('basicsLookupdataLookupDescriptorService').getItemByIdSync(projectId, {lookupType: 'project'});
											var estimateMainService = $injector.get('estimateMainService');

											// estimateProjectService.load() can't load the data here, so use the http request to get the data
											var postData = {
												projectFk: navProject.Id
											};

											$http.post(globals.webApiBaseUrl + 'estimate/project/list', postData).then(function (response) {
												var items = _.filter(response.data, function (estHeaderCompositeItem) {
													/** @namespace item.EstHeader */
													return estHeaderCompositeItem.EstHeader.Id === triggerField.Id;
												});
												items[0].projectInfo = {
													ProjectNo: navProject.ProjectNo,
													ProjectName: navProject.ProjectName
												};
												// user the estHeaderId to get the navigator estHeaderCompositeItem, and use it to navigator
												estimateMainService.setSelectedPrjEstHeader(items[0]);
												$injector.get('platformModuleNavigationService').navigate({
													moduleName: 'estimate.main'
												}, items[0]/* , 'cosMainInstance.Id' */ // Mike: disable the filter to show all of estimate lines winthin its header.
												);
											});

										}
									}
								},
								'descriptioninfo': {
									'readonly': true,
									'grid': {
										formatter: 'translation'
									}
								},
								'mdclineitemcontextfk': {
									'readonly': true,
									'grid': {
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'lineitemcontext',
											displayMember: 'Description'
										}
									}
								},
								'bascurrencyfk': {
									'readonly': true,
									'grid': {
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'currency',
											displayMember: 'Currency'
										}
									}
								}
							}
						};
					}
				};
			}
		]);

})();
