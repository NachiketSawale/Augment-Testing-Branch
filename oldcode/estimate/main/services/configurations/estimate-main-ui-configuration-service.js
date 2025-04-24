(function () {

	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainUIConfigurationService
	 * @function
	 *
	 * @description
	 * estimateMainUIConfigurationService is the config service for all estimate views.
	 */
	angular.module(moduleName).factory('estimateMainUIConfigurationService', ['$q', '$injector', '$translate', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'estimateCommonNavigationService', 'mainViewService','estimateMainSortCodesDialogService', 'estimateMainResourceType',
		function ($q, $injector, $translate, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, estimateCommonNavigationService, mainViewService,estimateMainSortCodesDialogService, estimateMainResourceType) {

			let service = {};

			angular.extend(service, {
				getEstimateMainLineItemDetailLayout: getEstimateMainLineItemDetailLayout,
				getEstimateMainCombinedLineItemDetailLayout: getEstimateMainCombinedLineItemDetailLayout,
				getEstimateMainLineItemDynamicColumnConfig: getEstimateMainLineItemDynamicColumnConfig,
				getEstimateMainResourceDetailLayout: getEstimateMainResourceDetailLayout,
				getStandardAllowancesDetailLayout: getStandardAllowancesDetailLayout,
				getStandardAllowancesCostCodeDetailLayout: getStandardAllowancesCostCodeDetailLayout
			});

			function navigateToAssembly(triggerOption, entity) {
				if(!entity.ProjectFk || entity.ProjectFk <= 0) {
					triggerOption.triggerModule = mainViewService.getCurrentModuleName();
					if (triggerOption.triggerModule === moduleName) {
						let selectedLienItem = $injector.get('estimateMainService').getSelected();
						if(selectedLienItem) {
							triggerOption.ProjectFk = selectedLienItem.ProjectFk;
						}
					}
				}
				else {
					triggerOption.ProjectFk = entity.ProjectFk;
				}
				estimateCommonNavigationService.navigateToAssembly(triggerOption, entity);

			}

			function navigateToInternal(triggerOption, entity){
				let navService = $injector.get('platformModuleNavigationService');
				let navigator = navService.getNavigator('estimate.main-internal');
				navService.navigate(navigator, entity, triggerOption);
			}

			var filters = [
				{
					key: 'estimate-filter',
					fn: function (item) {
						return item.IsEstimate;
					}
				}
			];
			$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);

			let estMainAssemblyTypesLookupInfo= {
				0: { // Assembly(Default)
					column: 'EstAssembyFk',
					lookup: {
						navigator: {
							moduleName: $translate.instant('estimate.assemblies.assembly'),
							navFunc: function (triggerFieldOption, entity) {
								navigateToAssembly(triggerFieldOption, entity);
							}
						},
						directive: 'estimate-main-assembly-template-lookup',
						options: {
							lookupDirective: 'estimate-main-assembly-template-lookup',
							descriptionMember: 'DescriptionInfo.Description',
							usageContext: 'estimateMainService',
							filterAssemblyKey: 'estimate-main-resources-prj-assembly-priority-filter',
							gridOptions: {
								multiSelect: true
							}
						},
						formatterOptions: {
							lookupType: 'estassemblyfk',
							displayMember: 'Code'
						}
					}
				},
				1: { // Plant Assembly
					column: 'EstAssembyFk',
					lookup: {
						directive: 'estimate-main-plant-assembly-dialog',
						options: {
							lookupDirective: 'estimate-main-plant-assembly-dialog',
							descriptionMember: 'DescriptionInfo.Description',
							usageContext: 'estimateMainService',
							gridOptions: {
								multiSelect: true
							}
						},
						formatterOptions: {
							lookupType: 'estplantassemblyfk',
							displayMember: 'Code'
						}
					}
				}};
			let detailsOverload = {
					'grid': {
						/* formatter: 'description',/!*function(row,cell,value){
						if(angular.isUndefined(value) || value === null){
							return '';
						}
						return _.toUpper(value);
					}*!/ */
						'formatter': function (row, cell, value, columnDef, dataContext) {
							return  $injector.get('basicsCommonStringFormatService').detail2CultureFormatter(row, cell, value, columnDef, dataContext);
						},
						'grouping': {'generic': false}
					}
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
				return angular.extend(basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.estquantityrel', 'Description', {
					showIcon: true,
					required: true,
					showClearButton: false
				}), {required:true});
			}
			function getDecimalPlacesOption(){
				return {
					decimalPlaces: function (columnDef, field) {
						return $injector.get('estimateMainRoundingService').getUiRoundingDigits(columnDef,field);
					}
				};
			}

			function isAllowanceValueColumn(columnName){
				const allowanceValueColumns = [
					'RpValue',
					'GaValue',
					'GcValue',
					'AmValue',
					'RpDjcValue',
					'GaDjcValue',
					'GcDjcValue',
					'AmDjcValue',
				];

				return allowanceValueColumns.indexOf(columnName) > -1;
			}

			function getAllowanceRoundingConfig(readonly,grouping){
				return {
					'readonly': readonly,
					'grouping': {'generic': grouping},
					'detail': {
						'options': getDecimalPlacesOption()
					},
					'grid': {
						editorOptions: getDecimalPlacesOption(),
						formatterOptions: getDecimalPlacesOption(),
						formatter: function(row, cell, value, columnDef, dataContext, plainText, uniqueId){
							let isValueColumn = isAllowanceValueColumn(columnDef.field);
							let activeAllowanceEntity = $injector.get('estimateMainContextDataService').getAllowanceEntity();
							if(activeAllowanceEntity && [1,3].indexOf(activeAllowanceEntity.MdcAllowanceTypeFk) > -1 && activeAllowanceEntity.IsOneStep && !isValueColumn ){
								return '<span></span>';
							}else{
								let css = $injector.get('platformGridDomainService').alignmentCssClass('money');
								let allowanceSelected = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
								let precessValue = value;
								if(allowanceSelected && isValueColumn){
									if([1,3].indexOf(allowanceSelected.MdcAllowanceTypeFk) > -1 && allowanceSelected.IsOneStep){
										if(dataContext.Id < 0){
											precessValue = dataContext.GcTotal;
											// dataContext.GcValue = dataContext.GcTotal;
										}else {
											return '<span></span>';
										}
									}else {
										precessValue = dataContext.normalGcValue;
										// dataContext.GcValue = dataContext.normalGcValue;
									}
								}
								let result = $injector.get('platformGridDomainService').formatter('money')(row, cell, precessValue, columnDef, dataContext, plainText, uniqueId);
								if (css && !plainText) {
									result = '<div class="' + css + '">' + result + '</div>';
								}
								return result;
							}
						}
					}
				};
			}

			function getRoundingDigitsConfig(readonly,grouping){
				return {
					'readonly': readonly,
					'grouping': {'generic': grouping},
					'detail': {
						'options': getDecimalPlacesOption()
					},
					'grid': {
						editorOptions: getDecimalPlacesOption(),
						formatterOptions: getDecimalPlacesOption(),
						// Fixed #143768:Clipboard in project assembly resources
						editor:'quantity'
					}
				};
			}

			function getSortCodeConfig(sortCodeDataService,displayMember,descriptionMember){
				return {
					'readonly':displayMember !== 'Code',
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-lookup-data-by-custom-data-service',
							'descriptionMember': descriptionMember,
							'lookupOptions': {
								'displayMember': displayMember,
								'valueMember': 'Id',
								'lookupType': sortCodeDataService,
								'dataServiceName': sortCodeDataService,
								'lookupModuleQualifier':sortCodeDataService,
								'disableDataCaching': false,
								'enableCache': true,
								'columns': [
									{
										'id': 'Code',
										'field': 'Code',
										'name': 'Code',
										'formatter': 'code',
										'name$tr$': 'cloud.common.entityCode'
									},
									{
										'id': 'Description',
										'field': 'DescriptionInfo',
										'name': 'Description',
										'formatter': 'translation',
										'name$tr$': 'cloud.common.entityDescription'
									}
								]
							}
						}
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'lookupDirective': 'basics-lookup-data-by-custom-data-service',
							'lookupType': sortCodeDataService,
							'lookupOptions': {
								'filterKey': null,
								'lookupType': sortCodeDataService,
								'dataServiceName': sortCodeDataService,
								'lookupModuleQualifier':sortCodeDataService,
								'valueMember': 'Id',
								'displayMember': displayMember,
								'additionalColumns': false,
								'showClearButton': true,
								'showAddButton': true,
								'disableDataCaching': false,
								'columns': [
									{
										'id': 'Code',
										'field': 'Code',
										'name': 'Code',
										'formatter': 'code',
										'name$tr$': 'cloud.common.entityCode'
									},
									{
										'id': 'Description',
										'field': 'DescriptionInfo',
										'name': 'Description',
										'formatter': 'translation',
										'name$tr$': 'cloud.common.entityDescription'
									}
								],
								openAddDialogFn: function ($injector, entity, settings) {
									estimateMainSortCodesDialogService.create(entity, settings);
									return $q.resolve();
								}
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': sortCodeDataService,
							'dataServiceName': sortCodeDataService,
							'displayMember': displayMember,
							'valueMember': 'Id'
						}
					}
				};
			}
			function getEstimateMainLineItemDetailLayout() {

				return {
					'fid': 'estimate.main.lineItem.detailform',
					'version': '1.0.2',
					'showGrouping': true,
					'change': 'change',
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['info', 'iteminfo', 'projectno', 'projectname', 'estimationcode', 'estimationdescription', 'code', 'estassemblyfk','estassemblydescriptioninfo','descriptioninfo',
								'basuomtargetfk', 'basuomfk', 'prjchangefk', 'orderchangefk','prjchangestatusfk', 'budgetunit', 'budget', 'budgetdifference', 'revenueunit', 'revenue', 'estlineitemstatusfk', 'margin1', 'margin2', 'assemblytype',
								'externalcode','budgetmargin','gcbreakdowntypefk']
						},
						{
							'gid': 'references',
							'attributes': ['estlineitemfk', 'estcostriskfk']
						},
						{
							'gid': 'ruleAndParam',
							'attributes': ['rule', 'param']
						},
						{
							'gid': 'itemQuantity',
							'attributes': ['quantitytargetdetail', 'quantitytarget', 'wqquantitytarget', 'wqquantitytargetdetail']
						},
						{
							'gid': 'quantityRelation',
							'attributes': ['estqtyrelboqfk', 'estqtyrelactfk', 'estqtyrelgtufk', 'estqtytelaotfk']
						},
						{
							'gid': 'quantiyAndFactors',
							'attributes': ['quantitydetail', 'quantity', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2',
								'quantityfactor3', 'quantityfactor4', 'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal',
								'co2sourcetotal', 'co2projecttotal', 'co2totalvariance']
						},
						{
							'gid': 'costFactors',
							'attributes': ['costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2']
						},
						{
							'gid': 'costAndHours',
							'attributes': ['costunit', 'costunittarget', 'costtotal', 'hoursunit', 'hoursunittarget', 'hourstotal', 'basecostunit','basecosttotal']
						},
						{
							'gid': 'directIndCost',
							'attributes': ['entcostunit', 'entcostunittarget', 'entcosttotal', 'enthoursunit', 'enthoursunittarget', 'enthourstotal',
								'drucostunit', 'drucostunittarget', 'drucosttotal', 'druhoursunit', 'druhoursunittarget', 'druhourstotal',
								'dircostunit', 'dircostunittarget', 'dircosttotal', 'dirhoursunit', 'dirhoursunittarget', 'dirhourstotal',
								'indcostunit', 'indcostunittarget', 'indcosttotal', 'indhoursunit', 'indhoursunittarget', 'indhourstotal',
								'markupcostunit', 'markupcostunittarget', 'markupcosttotal', 'grandcostunit', 'grandcostunittarget', 'grandtotal', 'escalationcosttotal', 'escalationcostunit', 'riskcostunit', 'riskcosttotal', 'dayworkrateunit', 'dayworkratetotal']
						},
						{
							'gid': 'flags',
							'attributes': ['islumpsum', 'isdisabled', 'isgc', 'isnomarkup', 'isfixedbudget', 'isfixedbudgetunit','isoptional', 'isnoescalation', 'isincluded', 'noleadquantity', 'isfixedprice', 'isoptionalit','isdurationquantityactivity','isdaywork']
						},
						{
							'gid': 'assignments',
							'attributes': ['mdccontrollingunitfk', 'boqitemfk', 'boqrootref', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk',
								'mdcassetmasterfk', 'prjlocationfk', 'lgmjobfk', 'boqwiccatfk', 'wicboqitemfk', 'wicboqheaderfk', 'boqsplitquantityfk']
						},
						{
							'gid': 'sortCodes',
							'attributes': ['sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk', 'sortdesc01fk', 'sortdesc02fk', 'sortdesc03fk', 'sortdesc04fk', 'sortdesc05fk', 'sortdesc06fk', 'sortdesc07fk', 'sortdesc08fk', 'sortdesc09fk', 'sortdesc10fk']
						},
						{
							'gid': 'packageAndCos',
							'attributes': ['packageassignments', 'prcstructurefk', 'cosinstancecode', 'cosinstancedescription', 'cosmasterheadercode', 'cosmasterheaderdescription']
						},
						{
							'gid': 'duration',
							'attributes': ['fromdate', 'todate']
						},
						{
							'gid': 'userDefText',
							'isUserDefText': true,
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'commenttext', 'hint', 'cosmatchtext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						},
						{
							'gid': 'currencies',
							'attributes': ['costexchangerate1', 'costexchangerate2', 'currency1fk', 'currency2fk', 'foreignbudget1', 'foreignbudget2']
						},
						{
							'gid': 'FormFk',
							'attributes': ['formfk']
						},
						{
							'gid': 'Allowance',
							'attributes': ['manualmarkupunititem', 'manualmarkupunit','manualmarkup','advancedallunititem','advancedallunit','advancedall',
								'gcunititem','gcunit','gc','gaunititem','gaunit','ga','amunititem','amunit','am','rpunititem','rpunit','rp',
								'allowanceunititem','allowanceunit','allowance','fm','urdunititem', 'urd']
						}
					],

					'overloads': {
						'info': {
							'readonly': true,
							'detail': {
								visible: false
							},
							'grid': {
								field: 'image',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'estimateMainLineItemImageProcessor',
									tooltip: true
								}
							}
						},

						'iteminfo': {
							'readonly': true,
							'detail': {
								visible: false
							},
							'grid': {
								field: 'ItemInfo',
								formatter: function (row, cell, value, columnDef, entity) {
									entity.ItemInfo = $injector.get('estimateMainCommonService').buildLineItemInfo(entity);
									return entity.ItemInfo;
								}
							}
						},
						'gcbreakdowntypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.generalcontractorbreakdowntype', 'Description'),
						'descriptioninfo': {
							maxLength: 255
						},
						'costfactor1': getRoundingDigitsConfig(false,false),
						'costfactor2': getRoundingDigitsConfig(false,false),
						'costexchangerate1':getRoundingDigitsConfig(true,false),
						'costexchangerate2':getRoundingDigitsConfig(true,false),
						'foreignbudget1': getRoundingDigitsConfig(true,true),
						'foreignbudget2': getRoundingDigitsConfig(true,true),
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
						'quantity': getRoundingDigitsConfig(false,false),
						'quantitydetail': detailsOverload,
						'quantitytargetdetail': detailsOverload,
						'wqquantitytargetdetail': detailsOverload,
						'quantityfactordetail1': detailsOverload,
						'quantityfactordetail2': detailsOverload,
						'quantityfactor1':  getRoundingDigitsConfig(false,false),
						'quantityfactor2': getRoundingDigitsConfig(false,false),
						'quantityfactor3': getRoundingDigitsConfig(false,false),
						'quantityfactor4':getRoundingDigitsConfig(false,false),
						'productivityfactordetail': detailsOverload,
						'productivityfactor':getRoundingDigitsConfig(false,false),
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
							'detail': {
								'type': 'directive',
								isTransient: true,
								'directive': 'estimate-rule-complex-lookup',
								'options': {
									'showClearButton': true,
									'showEditButton': false
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'basicsCustomizeRuleIconService'
								}
							},
							'grid': {
								isTransient: true,
								editor: 'directive',
								editorOptions: {
									showClearButton: true,
									'directive': 'estimate-rule-complex-lookup',
									grid: true
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'basicsCustomizeRuleIconService'
								},
								bulkSupport: false
							}
						},
						'param': {
							'detail': {
								'type': 'directive',
								'isTransient': true,
								'directive': 'estimate-param-complex-lookup',
								'options': {
									'showClearButton': true,
									'showEditButton': false,
									'itemName': 'EstLineItems'
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateParameterFormatterService',
									dataServiceMethod: 'getItemByParamAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'estimateParameterFormatterService',
									acceptFalsyValues: true
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
									acceptFalsyValues: true,
									showOverlayTemplate: true
								},
								bulkSupport: false
							}
						},
						'code': {
							'mandatory': true,
							'searchable': true,
							'grid': {
								bulkSupport: false
							}
						},
						'budget':  getRoundingDigitsConfig(false,false),
						'budgetdifference':  getRoundingDigitsConfig(true,false),
						'budgetunit': getRoundingDigitsConfig(false,false),
						'estlineitemstatusfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.estlineitemstatus', 'Description', {
							showIcon: true
						}),
						'margin1': getRoundingDigitsConfig(true,false),
						'margin2': getRoundingDigitsConfig(true,false),
						'budgetmargin': {
							readonly:true
						},
						'estlineitemfk': {
							navigator : {
								// moduleName: 'estimate.main-internal',
								moduleName: $translate.instant('estimate.main.referenceLineItem'),
								navFunc: function (triggerFieldOption, entity) {
									navigateToInternal(triggerFieldOption, entity);
								}
							},
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'estimate-main-est-line-item-lookup-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'est-lineitem-reference-filter'
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-est-line-item-lookup-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns,
										filterKey: 'est-lineitem-reference-filter',
										isFastDataRecording: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemlookup',
									filterKey: 'est-lineitem-reference-filter',
									displayMember: 'Code',
									useNewLookupType: true,
								}
							}
						},
						'revenueunit': getRoundingDigitsConfig( true, false),
						'revenue': getRoundingDigitsConfig(true, false),

						estassemblyfk: {
							detail: {
								type: 'directive',
								directive: 'estimate-dynamic-grid-and-form-lookup',
								options: {
									isTextEditable: false,
									dependantField: 'AssemblyType',
									lookupInfo: estMainAssemblyTypesLookupInfo,
									grid: false,
									dynamicLookupMode: true,
									showClearButton: true,
									lookupOptions: {showClearButton: true}
								}
							},
							grid: {
								formatter: 'dynamic',
								editor: 'dynamic',
								bulkSupport: false,
								domain: function (item, column) {
									var prop = estMainAssemblyTypesLookupInfo[item.AssemblyType];
									if (prop && prop.column) {
										column.editorOptions = {
											directive: prop.lookup.options.lookupDirective,
											lookupOptions: {
												showClearButton: true,
												isFastDataRecording: true,
												descriptionMember: prop.lookup.options.descriptionMember,
												gridOptions: prop.lookup.options.gridOptions,
												usageContext: prop.lookup.options.usageContext,
												lookupOptions:{
													filterAssemblyKey: prop.lookup.options.filterAssemblyKey
												}
											}
										};

										column.formatterOptions = prop.lookup.formatterOptions;

										let allowAssemblyTempNav = getTemplateNavigation();
										if(allowAssemblyTempNav){
											column.navigator = prop.lookup.navigator;
										} else {
											column.navigator = null;
										}

									} else {
										column.editorOptions = {readonly: true};
										column.formatterOptions = null;
									}
									return 'lookup';
								}
							}
						},
						'estassemblydescriptioninfo': {'readonly': true,'maxLength': 255},
						'quantityunittarget':  getRoundingDigitsConfig(true,false),
						'quantitytotal': {
							'grouping': {'generic': false},
							'detail': {
								'options': getDecimalPlacesOption()
							},
							'grid': {
								editorOptions: getDecimalPlacesOption(),
								formatterOptions: getDecimalPlacesOption()
							}
						},
						'costunit': getRoundingDigitsConfig(true,false),
						'costunittarget':  getRoundingDigitsConfig(true,false),
						'costtotal': getRoundingDigitsConfig(true,false),
						'basecostunit':getRoundingDigitsConfig(true,false),
						'basecosttotal': getRoundingDigitsConfig(true,false),
						'hoursunit': getRoundingDigitsConfig(true,false),
						'hoursunittarget': getRoundingDigitsConfig(true,false),
						'hourstotal': getRoundingDigitsConfig(true,false),
						'entcostunit': getRoundingDigitsConfig(true,false),
						'entcostunittarget':getRoundingDigitsConfig(true,false),
						'entcosttotal': getRoundingDigitsConfig(true,false),
						'enthoursunit': getRoundingDigitsConfig(true,false),
						'enthoursunittarget': getRoundingDigitsConfig(true,false),
						'enthourstotal': getRoundingDigitsConfig(true,false),
						'drucostunit': getRoundingDigitsConfig(true,false),
						'drucostunittarget': getRoundingDigitsConfig(true,false),
						'drucosttotal': getRoundingDigitsConfig(true,false),
						'druhoursunit': getRoundingDigitsConfig(true,false),
						'druhoursunittarget': getRoundingDigitsConfig(true,false),
						'druhourstotal': getRoundingDigitsConfig(true,false),
						'dircostunit':getRoundingDigitsConfig(true,false),
						'dircostunittarget': getRoundingDigitsConfig(true,false),
						'dircosttotal':getRoundingDigitsConfig(true,false),
						'dirhoursunit': getRoundingDigitsConfig(true,false),
						'dirhoursunittarget': getRoundingDigitsConfig(true,false),
						'dirhourstotal':getRoundingDigitsConfig(true,false),
						'indcostunit': getRoundingDigitsConfig(true,false),
						'indcostunittarget':getRoundingDigitsConfig(true,false),
						'indcosttotal': getRoundingDigitsConfig(true,false),
						'indhoursunit': getRoundingDigitsConfig(true,false),
						'indhoursunittarget': getRoundingDigitsConfig(true,false),
						'indhourstotal':getRoundingDigitsConfig(true,false),
						'markupcostunit': getRoundingDigitsConfig(true,false),
						'markupcostunittarget': getRoundingDigitsConfig(true,false),
						'markupcosttotal':getRoundingDigitsConfig(true,false),
						'grandcostunit': getRoundingDigitsConfig(true,false),
						'grandcostunittarget': getRoundingDigitsConfig(false,false),
						'grandtotal': getRoundingDigitsConfig(true,false),
						'hint': {'readonly': true},
						'riskcostunit': getRoundingDigitsConfig(true, false),
						'riskcosttotal': getRoundingDigitsConfig(true, false),
						'dayworkratetotal': getRoundingDigitsConfig(true, false),
						'dayworkrateunit': getRoundingDigitsConfig(true, false),
						'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}, {required: false}),
						'wqquantitytarget': getRoundingDigitsConfig(false,false),
						'quantitytarget': getRoundingDigitsConfig(false, false),
						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),

						'estcostriskfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description', {
							showClearButton: true,
							grouping: {generic: true}
						}),

						'mdccontrollingunitfk': {
							navigator: {
								moduleName: 'controlling.structure'
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'controlling-structure-dialog-lookup',
									'descriptionMember': 'DescriptionInfo.Translated',
									'lookupOptions': {
										'filterKey': 'estimate-prj-controlling-unit-filter',
										'showClearButton': true,
										considerPlanningElement: true,
										selectableCallback: function () {
											return true;
										}
									},
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns,
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'controlling-structure-dialog-lookup',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'estimate-prj-controlling-unit-filter',
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns,
										considerPlanningElement: true,
										selectableCallback: function(){
											return true;
										},
										isFastDataRecording: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'controllingunit',
									useNewLookupType: true,
									filterKey: 'controlling.structure.estimate.prjcontrollingunit.filter',
									displayMember: 'Code'
								}
							}
						},

						'boqitemfk': {
							navigator: {
								moduleName: 'boq.main',
								'navFunc': function (triggerFieldOption, item) {
									var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
									if (boqRuleComplexLookupService) {
										boqRuleComplexLookupService.setNavFromBoqProject();
										$injector.get('boqMainService').setList([]);
										var estimateMainService = $injector.get('estimateMainService');
										if (estimateMainService) {
											estimateMainService.updateAndExecute(function () {
												var projectId = estimateMainService.getSelectedProjectId();
												boqRuleComplexLookupService.setProjectId(projectId);
												boqRuleComplexLookupService.loadLookupData().then(function () {
													triggerFieldOption.ProjectFk = projectId;
													triggerFieldOption.NavigatorFrom = 'EstBoqItemNavigator';
													$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, item, triggerFieldOption);
												});
											});
										}
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-boq-item-lookup',
								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-boq-item-lookup',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Reference',
										'addGridColumns': [
											{
												id: 'brief',
												field: 'BriefInfo',
												name: 'Brief',
												width: 120,
												toolTip: 'Brief',
												formatter: 'translation',
												name$tr$: 'estimate.main.briefInfo'
											}
										],
										isFastDataRecording: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estboqitems',
									useNewLookupType: true,
									displayMember: 'Reference',
									dataServiceName:'estimateMainBoqItemService',
									mainServiceName:'estimateMainService'
								}
							}
						},

						'boqrootref': {
							'readonly': true,
							'detail': {
								model: 'BoqHeaderFk',
								type: 'directive',
								directive: 'estimate-main-root-boq-item',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estBoqHeaders',
									displayMember: 'Reference',
									dataServiceName: 'estimateMainBoqHeaderService',
									mainServiceName:'estimateMainService'
								},
								bulkSupport: false
							},
							'grid': {
								field: 'BoqHeaderFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estBoqHeaders',
									displayMember: 'Reference',
									dataServiceName: 'estimateMainBoqHeaderService',
									mainServiceName:'estimateMainService'
								},
								bulkSupport: false
							}
						},

						'wicboqitemfk': {
							navigator: {
								moduleName: 'boq.main',
								'navFunc': function (triggerFieldOption, item) {
									var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
									if (boqRuleComplexLookupService) {
										boqRuleComplexLookupService.setNavFromBoqWic();

										$injector.get('boqMainService').setList([]);
										var estimateMainService = $injector.get('estimateMainService');
										if (estimateMainService) {
											estimateMainService.updateAndExecute(function () {
												boqRuleComplexLookupService.loadLookupData().then(function () {
													triggerFieldOption.NavigatorFrom = 'WicBoqItemNavigator';
													$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, item, triggerFieldOption);
												});
											});
										}
									}
								}
							},
							'detail': {
								'model': 'WicBoqItemFk',
								'type': 'directive',
								'directive': 'estimate-main-wic-item-lookup',
								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
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
										],
										isFastDataRecording: true
									}
								},
								field: 'WicBoqItemFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'wicboqitems',
									displayMember: 'Reference',
									dataServiceName: 'boqWicItemService',
									useNewLookupType: true
								},
								'grouping': {'generic': true}
							}
						},

						'boqwiccatfk': {
							'readonly': true,
							'grouping': {'generic': true},
							'detail': {
								model: 'BoqWicCatFk',
								type: 'directive',
								directive: 'estimate-wic-group-lookup',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'WicGroupFk',
									displayMember: 'Code',
									dataServiceName: 'boqWicGroupService'
								}
							},
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

						'wicboqheaderfk':
							{
								'readonly': true,
								'detail': {
									model: 'WicBoqItemFk',
									type: 'directive',
									directive: 'estimate-main-wic-root-item-lookup',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'wicboqheaderitems',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainWicBoqRootItemLookupService'
									}
								},
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

						'psdactivityschedule': {
							'navigator': {
								moduleName: 'scheduling.main'
							},
							'readonly': true,
							'detail': {
								model: 'PsdActivityFk',
								type: 'directive',
								directive: 'estimate-main-activity-schedule',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityScheduleLookupService'
								}
							},
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
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-activity-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
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
										}],
										isFastDataRecording: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									useNewLookupType: true,
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityLookupService'
								}
							}
						},

						'prjlocationfk': {
							navigator: {
								moduleName: 'project.main-location'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-location-dialog',
								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-location-dialog',
									lookupOptions: {
										showClearButton: true,
										additionalColumns: true,
										displayMember: 'Code',
										addGridColumns: addColumns,
										isFastDataRecording: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estLineItemLocation',
									displayMember: 'Code',
									dataServiceName: 'estimateMainLocationLookupService',
									useNewLookupType: true
								}
							}
						},

						'mdcworkcategoryfk': {
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
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-mdc-work-category-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},

						'mdcassetmasterfk': {
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
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-asset-master-dialog',
									'lookupOptions': {
										'showClearButton': true
									}
								}
							}
						},


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
										'isFastDataRecording': true,
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
									'displayMember': 'Code',
									'childProp': 'ChildItems'
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
						'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'estimateMainJobLookupByProjectDataService',
							cacheEnable: true,
							additionalColumns: false,
							filter: function () {
								return $injector.get('estimateMainService').getSelectedProjectId();

							}
						}),
						'prjchangefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'estimate-project-change-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										createOptions: {
											typeOptions: {
												isProjectChange: true
											}
										},
										filterKey: 'estimate-main-project-change-common-filter',
									},
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription',
										formatter: 'description',
										readonly: true
									}]
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-project-change-dialog',
									lookupOptions: {
										'showClearButton': true,
										createOptions: {
											typeOptions: {
												isProjectChange: true
											}
										},
										filterKey: 'estimate-main-project-change-common-filter',
										additionalColumns: true,
										addGridColumns: [{
											id: 'Description',
											field: 'Description',
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'description',
											readonly: true
										}]
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									version: 3,
									lookupType: 'ProjectChangeNotOrderType',
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
									dataServiceName: 'estimateMainPrjChangeStatusLookupService',
									displayMember: 'Description',
									imageSelector: 'platformStatusIconService'
								}
							}
						},
						'orderchangefk':{
							readonly: true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'estimate-project-change-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
									},
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription',
										formatter: 'description',
										readonly: true
									}]
								},
								readonly: true
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-project-change-dialog',
									lookupOptions: {
										'showClearButton': true,
										additionalColumns: true,
										addGridColumns: [{
											id: 'Description',
											field: 'Description',
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'description',
											readonly: true
										}]
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									version: 3,
									lookupType: 'projectchange',
									displayMember: 'Code'
								},
								width: 130
							}
						},
						'escalationcosttotal': getRoundingDigitsConfig(true, false),
						'escalationcostunit': getRoundingDigitsConfig( true, false),
						'estqtyrelboqfk': getEstQtyRelConfig(),
						'estqtyrelactfk': getEstQtyRelConfig(),
						'estqtyrelgtufk': getEstQtyRelConfig(),
						'estqtytelaotfk': getEstQtyRelConfig(),
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
							'detail': {
								'type': 'dateutc',
								formatter: 'dateutc'
							},
							'grid': {
								editor: 'dateutc',
								formatter: 'dateutc'
							}
						},
						'todate': {
							'detail': {
								'type': 'dateutc',
								formatter: 'dateutc'
							},
							'grid': {
								editor: 'dateutc',
								formatter: 'dateutc'
							}
						},

						'userdefined1': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined2': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined3': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined4': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined5': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},

						'sortcode01fk': getSortCodeConfig('estimateMainSortCode01LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc01fk': getSortCodeConfig('estimateMainSortCode01LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode02fk': getSortCodeConfig('estimateMainSortCode02LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc02fk': getSortCodeConfig('estimateMainSortCode02LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode03fk': getSortCodeConfig('estimateMainSortCode03LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc03fk': getSortCodeConfig('estimateMainSortCode03LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode04fk': getSortCodeConfig('estimateMainSortCode04LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc04fk': getSortCodeConfig('estimateMainSortCode04LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode05fk': getSortCodeConfig('estimateMainSortCode05LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc05fk': getSortCodeConfig('estimateMainSortCode05LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode06fk': getSortCodeConfig('estimateMainSortCode06LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc06fk': getSortCodeConfig('estimateMainSortCode06LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode07fk': getSortCodeConfig('estimateMainSortCode07LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc07fk': getSortCodeConfig('estimateMainSortCode07LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode08fk': getSortCodeConfig('estimateMainSortCode08LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc08fk': getSortCodeConfig('estimateMainSortCode08LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode09fk': getSortCodeConfig('estimateMainSortCode09LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc09fk': getSortCodeConfig('estimateMainSortCode09LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode10fk': getSortCodeConfig('estimateMainSortCode10LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc10fk': getSortCodeConfig('estimateMainSortCode10LookupDataService','DescriptionInfo.Translated','Code'),

						'cosmatchtext': {readonly: true},
						'formfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'estimateRuleUserformLookupService',
							enableCache: true,
							filter: function () {
								return 78; // Rubric 'Estimate' from [BAS_RUBRIC]
							}
						}),

						'boqsplitquantityfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							bulkSupport: false,
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
						'isfixedprice': {
							readonly: false
						},

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
									sorting:2,
									sortOrder:2
								}
							]
						}),
						'manualmarkupunititem':  getRoundingDigitsConfig(false,false),
						'manualmarkupunit':  getRoundingDigitsConfig(false,false),
						'manualmarkup':  getRoundingDigitsConfig(false,false),
						'advancedallunititem': getRoundingDigitsConfig(false,false),
						'advancedallunit':getRoundingDigitsConfig(false,false),
						'advancedall':getRoundingDigitsConfig(false,false),
						'gcunititem': getAllowanceRoundingConfig(true,false),
						'gcunit':  getAllowanceRoundingConfig(true,false),
						'gc':  getAllowanceRoundingConfig(true,false),
						'gaunititem': getAllowanceRoundingConfig(true,false),
						'gaunit':getAllowanceRoundingConfig(true,false),
						'ga': getAllowanceRoundingConfig(true,false),
						'amunititem': getAllowanceRoundingConfig(true,false),
						'amunit': getAllowanceRoundingConfig(true,false),
						'am': getAllowanceRoundingConfig(true,false),
						'rpunititem': getAllowanceRoundingConfig(true,false),
						'rpunit': getAllowanceRoundingConfig(true,false),
						'rp':getAllowanceRoundingConfig(true,false),
						'allowanceunititem': getRoundingDigitsConfig(true,false),
						'allowanceunit': getRoundingDigitsConfig(true,false),
						'allowance': getRoundingDigitsConfig(true,false),
						'fm': getRoundingDigitsConfig(true,false),
						'urdunititem': getRoundingDigitsConfig(true,false),
						'urd': getRoundingDigitsConfig(true,false),
						'isoptionalit': {'readonly': false, 'grouping': {'generic': false}},
						'packageassignments': {
							'readonly':true,
							'width': 200,
							'grouping': {'generic': false,'aggregateCollapsed':true}
						},
						'co2sourcetotal':{'readonly': true},
						'co2projecttotal':{'readonly': true},
						'co2totalvariance':{'readonly': true}
					}
				};
			}

			function getEstimateMainCombinedLineItemDetailLayout() {

				return {
					'fid': 'estimate.main.combinedlineItem.detailform',
					'version': '1.0.2',
					'showGrouping': true,
					'change': 'change',
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['info', 'projectno', 'projectname', 'estimationcode', 'estimationdescription', 'code', 'estassemblyfk', 'descriptioninfo',
								'basuomtargetfk', 'basuomfk', 'prjchangefk', 'prjchangestatusfk', 'budgetunit', 'budget', 'budgetdifference', 'revenueunit', 'revenue', 'estlineitemstatusfk', 'margin1', 'margin2']
						},
						{
							'gid': 'references',
							'attributes': ['estlineitemfk', 'estcostriskfk']
						},
						{
							'gid': 'ruleAndParam',
							'attributes': ['rule', 'param']
						},
						{
							'gid': 'itemQuantity',
							'attributes': ['quantitytargetdetail', 'quantitytarget', 'wqquantitytarget', 'wqquantitytargetdetail']
						},
						{
							'gid': 'quantityRelation',
							'attributes': ['estqtyrelboqfk', 'estqtyrelactfk', 'estqtyrelgtufk', 'estqtytelaotfk']
						},
						{
							'gid': 'quantiyAndFactors',
							'attributes': ['quantitydetail', 'quantity', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2',
								'quantityfactor3', 'quantityfactor4', 'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal']
						},
						{
							'gid': 'costFactors',
							'attributes': ['costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2']
						},
						{
							'gid': 'costAndHours',
							'attributes': ['costunit', 'costunittarget', 'costtotal', 'hoursunit', 'hoursunittarget', 'hourstotal', 'basecostunit','basecosttotal']
						},
						{
							'gid': 'directIndCost',
							'attributes': ['entcostunit', 'entcostunittarget', 'entcosttotal', 'enthoursunit', 'enthoursunittarget', 'enthourstotal',
								'drucostunit', 'drucostunittarget', 'drucosttotal', 'druhoursunit', 'druhoursunittarget', 'druhourstotal',
								'dircostunit', 'dircostunittarget', 'dircosttotal', 'dirhoursunit', 'dirhoursunittarget', 'dirhourstotal',
								'indcostunit', 'indcostunittarget', 'indcosttotal', 'indhoursunit', 'indhoursunittarget', 'indhourstotal',
								'markupcostunit', 'markupcostunittarget', 'markupcosttotal', 'grandcostunit', 'grandcostunittarget', 'grandtotal', 'escalationcosttotal', 'escalationcostunit', 'riskcostunit', 'riskcosttotal']
						},
						{
							'gid': 'flags',
							'attributes': ['islumpsum', 'isdisabled', 'isgc', 'isnomarkup', 'isfixedbudget', 'isfixedbudgetunit','isoptional', 'isnoescalation', 'isincluded', 'noleadquantity', 'isfixedprice']
						},
						{
							'gid': 'assignments',
							'attributes': ['mdccontrollingunitfk', 'boqitemfk', 'boqrootref', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk',
								'mdcassetmasterfk', 'prjlocationfk', 'lgmjobfk', 'boqwiccatfk', 'wicboqitemfk', 'wicboqheaderfk', 'boqsplitquantityfk']
						},
						{
							'gid': 'sortCodes',
							'attributes': ['sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk', 'sortdesc01fk', 'sortdesc02fk', 'sortdesc03fk', 'sortdesc04fk', 'sortdesc05fk', 'sortdesc06fk', 'sortdesc07fk', 'sortdesc08fk', 'sortdesc09fk', 'sortdesc10fk']
						},
						{
							'gid': 'packageAndCos',
							'attributes': ['prcstructurefk', 'cosinstancecode', 'cosinstancedescription', 'cosmasterheadercode', 'cosmasterheaderdescription']
						},
						{
							'gid': 'duration',
							'attributes': ['fromdate', 'todate']
						},
						{
							'gid': 'userDefText',
							'isUserDefText': true,
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'commenttext', 'hint', 'cosmatchtext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						},
						{
							'gid': 'currencies',
							'attributes': ['costexchangerate1', 'costexchangerate2', 'currency1fk', 'currency2fk', 'foreignbudget1', 'foreignbudget2']
						},
						{
							'gid': 'FormFk',
							'attributes': ['formfk']
						}
					],

					'overloads': {
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
						'descriptioninfo': {
							maxLength: 255
						},
						'costfactor1': {'grouping': {'generic': false}},
						'costfactor2': {'grouping': {'generic': false}},

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
						'quantity': {'grouping': {'generic': false}},
						'quantitydetail': detailsOverload,
						'quantitytargetdetail': detailsOverload,
						'wqquantitytargetdetail': detailsOverload,
						'quantityfactordetail1': detailsOverload,
						'quantityfactordetail2': detailsOverload,
						'quantityfactor1': {'grouping': {'generic': false}},
						'quantityfactor2': {'grouping': {'generic': false}},
						'quantityfactor3': {'grouping': {'generic': false}},
						'quantityfactor4': {'grouping': {'generic': false}},
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
							'detail': {
								'type': 'directive',
								isTransient: true,
								'directive': 'estimate-rule-complex-lookup',
								'options': {
									'showClearButton': true,
									'showEditButton': false
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'basicsCustomizeRuleIconService'
								}
							},
							'grid': {
								isTransient: true,
								editor: 'directive',
								editorOptions: {
									showClearButton: true,
									'directive': 'estimate-rule-complex-lookup',
									grid: true
								},
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'basicsCustomizeRuleIconService'
								},
								bulkSupport: false
							}
						},
						'param': {
							'detail': {
								'type': 'directive',
								'isTransient': true,
								'directive': 'estimate-param-complex-lookup',
								'options': {
									'showClearButton': true,
									'showEditButton': false
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
									serviceName: 'estimateParameterFormatterService'
								},
								bulkSupport: false
							}
						},
						'code': {
							'mandatory': true,
							'searchable': true,
							'grid': {
								bulkSupport: false
							}
						},
						'budget': {'grouping': {'generic': false}},
						'budgetdifference': {
							readonly: true
						},
						'budgetunit': {'grouping': {'generic': false}},
						'estlineitemstatusfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.estlineitemstatus', 'Description', {
							showIcon: true
						}),
						'margin1': {'readonly': true, 'grouping': {'generic': false}},
						'margin2': {'readonly': true, 'grouping': {'generic': false}},
						'estlineitemfk': {
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'estimate-main-est-line-item-lookup-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'est-lineitem-reference-filter'
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-est-line-item-lookup-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns,
										filterKey: 'est-lineitem-reference-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemlookup',
									displayMember: 'Code'
								}
							}
						},
						'revenue': {'grouping': {'generic': false}},
						estassemblyfk: {
							navigator: {
								moduleName: $translate.instant('estimate.assemblies.assembly'),
								navFunc: function (item, triggerField) {
									var naviService = $injector.get('platformModuleNavigationService');
									var navigator = naviService.getNavigator('estimate.assemblies');

									naviService.navigate(navigator, triggerField, item.field);
								}
							},
							detail: {
								type: 'directive',
								directive: 'estimate-main-assembly-template-lookup',
								options: {
									isTextEditable: false,
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-assembly-template-lookup',
									lookupOptions: {
										showClearButton: true,
										isTextEditable: false,
										gridOptions: {
											multiSelect: true
										}
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estassemblyfk',
									displayMember: 'Code'
								}
							}
						},
						'quantityunittarget': {'readonly': true, 'grouping': {'generic': false}},
						'quantitytotal': {'readonly': true, 'grouping': {'generic': false}},
						'costunit': {'readonly': false, 'grouping': {'generic': false}},
						'costunittarget': {'readonly': true, 'grouping': {'generic': false}},
						'costtotal': {
							'readonly': false,
							'grouping': {'generic': false}
						},
						'basecostunit': {'readonly': true, 'grouping': {'generic': false}},
						'basecosttotal': {'readonly': true, 'grouping': {'generic': false}},
						'hoursunit': {'readonly': false, 'grouping': {'generic': false}},
						'hoursunittarget': {'readonly': true, 'grouping': {'generic': false}},
						'hourstotal': {'readonly': false, 'grouping': {'generic': false}},
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
						'grandtotal': {'readonly': true, 'grouping': {'generic': false}},
						'grandcostunit': {'readonly': true, 'grouping': {'generic': false}},
						'grandcostunittarget': {'readonly': true, 'grouping': {'generic': false}},
						'hint': {'readonly': true},
						'riskcostunit': {'readonly': true},
						'riskcosttotal': {'readonly': true},
						'dayworkratetotal': {'readonly': true, 'grouping': {'generic': false}},
						'dayworkrateunit': {'readonly': true, 'grouping': {'generic': false}},
						'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}, {required: false}),
						'wqquantitytarget': {'grouping': {'generic': false}},
						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),

						'estcostriskfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description', {
							showClearButton: true,
							grouping: {generic: true}
						}),

						'mdccontrollingunitfk': {
							navigator: {
								moduleName: 'controlling.structure'
							},
							'detail': {
								'type': 'directive',
								'directive': 'controlling-Structure-Prj-Controlling-Unit-Lookup',

								'options': {
									'eagerLoad': true,
									'showClearButton': true,
									'filterKey': 'est-prj-controlling-unit-filter',
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns,
								}
							},
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

						'boqitemfk': {
							navigator: {
								moduleName: 'boq.main',
								'navFunc': function (triggerFieldOption, item) {
									$injector.get('estimateCommonNavigationService').navigateToBoq(item, triggerFieldOption);
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-boq-item-lookup',
								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-boq-item-lookup',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Reference',
										'addGridColumns': [
											{
												id: 'brief',
												field: 'BriefInfo',
												name: 'Brief',
												width: 120,
												toolTip: 'Brief',
												formatter: 'translation',
												name$tr$: 'estimate.main.briefInfo'
											}
										]
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estboqitems',
									displayMember: 'Reference',
									dataServiceName: 'estimateMainBoqItemService',
									mainServiceName:'estimateMainCombineLineItemService'
								}
							}
						},

						'boqrootref': {
							'readonly': true,
							'detail': {
								model: 'BoqHeaderFk',
								type: 'directive',
								directive: 'estimate-main-root-boq-item',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estBoqHeaders',
									displayMember: 'Reference',
									dataServiceName: 'estimateMainBoqHeaderService',
									mainServiceName:'estimateMainCombineLineItemService'
								},
								bulkSupport: false
							},
							'grid': {
								field: 'BoqHeaderFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estBoqHeaders',
									displayMember: 'Reference',
									dataServiceName: 'estimateMainBoqHeaderService',
									mainServiceName:'estimateMainCombineLineItemService'
								},
								bulkSupport: false
							}
						},

						'wicboqitemfk': {
							navigator: {
								moduleName: 'boq.main',
								'navFunc': function (triggerFieldOption, item) {
									let boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
									if (boqRuleComplexLookupService) {
										boqRuleComplexLookupService.setNavFromBoqWic();

										$injector.get('boqMainService').setList([]);
										let estimateMainService = $injector.get('estimateMainService');
										if (estimateMainService) {
											estimateMainService.updateAndExecute(function () {
												boqRuleComplexLookupService.loadLookupData().then(function () {
													triggerFieldOption.NavigatorFrom = 'WicBoqItemNavigator';
													$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, item, triggerFieldOption);
												});
											});
										}
									}
								}
							},
							'detail': {
								'model': 'WicBoqItemFk',
								'type': 'directive',
								'directive': 'estimate-main-wic-item-lookup',
								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
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

						'boqwiccatfk': {
							'readonly': true,
							'grouping': {'generic': true},
							'detail': {
								model: 'BoqWicCatFk',
								type: 'directive',
								directive: 'estimate-wic-group-lookup',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'WicGroupFk',
									displayMember: 'Code',
									dataServiceName: 'boqWicGroupService'
								}
							},
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

						'wicboqheaderfk':
							{
								'readonly': true,
								'detail': {
									model: 'WicBoqItemFk',
									type: 'directive',
									directive: 'estimate-main-wic-root-item-lookup',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'wicboqheaderitems',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainWicBoqRootItemLookupService'
									}
								},
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

						'psdactivityschedule': {
							'navigator': {
								moduleName: 'scheduling.main'
							},
							'readonly': true,
							'detail': {
								model: 'PsdActivityFk',
								type: 'directive',
								directive: 'estimate-main-activity-schedule',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityScheduleLookupService'
								}
							},
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
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-activity-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
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
							navigator: {
								moduleName: 'project.main-location'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-location-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
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
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-mdc-work-category-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},

						'mdcassetmasterfk': {
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
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-asset-master-dialog',
									'lookupOptions': {
										'showClearButton': true
									}
								}
							}
						},
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
										'isFastDataRecording': true,
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
									'displayMember': 'Code',
									'childProp': 'ChildItems'
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
						'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'estimateMainJobLookupByProjectDataService',
							cacheEnable: true,
							additionalColumns: false,
							filter: function () {
								return $injector.get('estimateMainService').getSelectedProjectId();

							}
						}),
						'prjchangefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'project-change-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										createOptions: {
											typeOptions: {
												isProjectChange: true
											}
										},
										filterKey: 'estimate-main-project-change-common-filter'
									},
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription',
										formatter: 'description',
										readonly: true
									}]
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'project-change-dialog',
									lookupOptions: {
										'showClearButton': true,
										filterKey: 'estimate-main-project-change-common-filter',
										additionalColumns: true,
										addGridColumns: [{
											id: 'Description',
											field: 'Description',
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'description',
											readonly: true
										}]
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
									dataServiceName: 'estimateMainPrjChangeStatusLookupService',
									displayMember: 'Description',
									imageSelector: 'platformStatusIconService'
								}
							}
						},
						'escalationcosttotal': {'readonly': true},
						'escalationcostunit': {'readonly': true},
						'estqtyrelboqfk': getEstQtyRelConfig(),
						'estqtyrelactfk': getEstQtyRelConfig(),
						'estqtyrelgtufk': getEstQtyRelConfig(),
						'estqtytelaotfk': getEstQtyRelConfig(),
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
							'detail': {
								'type': 'dateutc',
								formatter: 'dateutc'
							},
							'grid': {
								editor: 'dateutc',
								formatter: 'dateutc'
							}
						},
						'todate': {
							'detail': {
								'type': 'dateutc',
								formatter: 'dateutc'
							},
							'grid': {
								editor: 'dateutc',
								formatter: 'dateutc'
							}
						},

						'userdefined1': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined2': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined3': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined4': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},
						'userdefined5': {
							'grid': {
								'maxLength': 252
							},
							'detail': {
								'maxLength': 252
							}
						},

						'sortcode01fk': getSortCodeConfig('estimateMainSortCode01LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc01fk': getSortCodeConfig('estimateMainSortCode01LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode02fk': getSortCodeConfig('estimateMainSortCode02LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc02fk': getSortCodeConfig('estimateMainSortCode02LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode03fk': getSortCodeConfig('estimateMainSortCode03LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc03fk': getSortCodeConfig('estimateMainSortCode03LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode04fk': getSortCodeConfig('estimateMainSortCode04LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc04fk': getSortCodeConfig('estimateMainSortCode04LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode05fk': getSortCodeConfig('estimateMainSortCode05LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc05fk': getSortCodeConfig('estimateMainSortCode05LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode06fk': getSortCodeConfig('estimateMainSortCode06LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc06fk': getSortCodeConfig('estimateMainSortCode06LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode07fk': getSortCodeConfig('estimateMainSortCode07LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc07fk': getSortCodeConfig('estimateMainSortCode07LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode08fk': getSortCodeConfig('estimateMainSortCode08LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc08fk': getSortCodeConfig('estimateMainSortCode08LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode09fk': getSortCodeConfig('estimateMainSortCode09LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc09fk': getSortCodeConfig('estimateMainSortCode09LookupDataService','DescriptionInfo.Translated','Code'),
						'sortcode10fk': getSortCodeConfig('estimateMainSortCode10LookupDataService','Code','DescriptionInfo.Translated'),
						'sortdesc10fk': getSortCodeConfig('estimateMainSortCode10LookupDataService','DescriptionInfo.Translated','Code'),

						'cosmatchtext': {readonly: true},
						'formfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'estimateRuleUserformLookupService',
							enableCache: true,
							filter: function () {
								return 78; // Rubric 'Estimate' from [BAS_RUBRIC]
							}
						}),

						'boqsplitquantityfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							bulkSupport: false,
							dataServiceName: 'basicsBoqSplitQuantityLookupDataService',
							'valMember': 'Id',
							'dispMember': 'SplitNo',
							filter: function (item) {
								let currentBoqItemAndBoqHeader = null;
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
										let lookupItem = args.selectedItem;
										let item = args.entity;
										if (item && lookupItem) {
											item.BoqSplitQuantityFk = lookupItem.Id;
										}
									}
								}]
						}),
						'isfixedprice': {
							readonly: true
						}
					}
				};
			}

			// DynamicConfigSetUp: 1. SetUp UI Configuration
			function getEstimateMainLineItemDynamicColumnConfig(){

				// let estimateMainResourceConfigurationService = $injector.get('estimateMainResourceConfigurationService');
				let estimateMainCommonService = $injector.get('estimateMainCommonService');

				return {
					'fid': 'estimate.main.lineItem.dynamic',
					'version': '1.0.0',
					'usageServiceContext': 'estimateMainService', // Mandatory
					'usageValidationContext': 'estimateMainValidationService', // Mandatory
					'groups': [
						{
							'gid': 'ConfDetail',
							'attributes': ['notassignedcosttotal'], // static fields
							'options': {
								'dtoName': 'ColumnConfigDetails',
								'propertyFn': function(dtoItem){

									let fieldTag = 'ConfDetail';
									let columnDetail = {
										grid: {},
										detail: {}
									}; // propertyInfo

									let estimateMainConfigDetailService = $injector.get('estimateMainConfigDetailService');
									let id = estimateMainConfigDetailService.getIdByColumnId(dtoItem.ColumnId);

									if (id !== null){
										let columnInfo = getEstimateMainResourceDetailLayout().overloads[id];
										if (columnInfo !== undefined && columnInfo !== null) {

											if (dtoItem.LineType !== 1){
												columnDetail = columnInfo;
												if (id === 'code'){
													columnDetail.grid.editor = 'lookup';
													columnDetail.grid.editorOptions.directive = 'estimate-main-material-lookup';
													columnDetail.grid.editorOptions.lookupOptions.lookupField = fieldTag + dtoItem.Id;
													columnDetail.grid.editorOptions.lookupOptions.displayMember = 'Code';
													columnDetail.grid.editorOptions.lookupOptions.valueMember = 'Id';
													columnDetail.grid.editorOptions.lookupOptions.isTextEditable = false;
													columnDetail.grid.editorOptions.lookupOptions.materialFkField = fieldTag + dtoItem.Id;
													columnDetail.grid.editorOptions.lookupOptions.isFastDataRecording = true;
													columnDetail.grid.formatter = 'lookup';
													columnDetail.grid.formatterOptions = {
														lookupType: 'MaterialRecord',
														displayMember: 'Code',
														dataServiceName: 'estimateMainMaterialFastInputDataService',
													};

													columnDetail.detail.type = 'directive';
													columnDetail.detail.directive = 'basics-lookupdata-lookup-composite';
													columnDetail.detail.options = {
														showClearButton: true,
														lookupField: fieldTag + dtoItem.Id,
														gridOptions: {
															multiSelect: false,
															showDayworkRate:true
														},
														isTextEditable: false,
														grid: false,
														lookupDirective: 'estimate-main-material-lookup',
														descriptionMember: 'Code',
														lookupOptions: {
															'showClearButton': true,
															'additionalColumns': false,
															'displayMember': 'Code',
															'filterOptions': {

															},
														}
													};
												}
											}
										}
									}
									// Extra fields //TODO: it does not work in detail view!
									columnDetail.grid.columnid = dtoItem.Id;
									columnDetail.detail.columnid = dtoItem.Id;

									columnDetail.name = dtoItem.DescriptionInfo.Translated || dtoItem.DescriptionInfo.Description;

									return columnDetail;
								}
							}
						},
						{
							'gid': 'UDP',
							'attributes': [],
							'options': {
								'mainService': 'estimateMainService',
								'dtoName': 'UDP',
								'filter': function (dtoItem) {
									return dtoItem.IsLive;
								},
								'propertyFn': function(dtoItem){
									return {
										name: dtoItem.DescriptionInfo.Description,
										mandatory: false,
										readonly: true,
										domain: 'money'

									};
								}
							}
						},
						// {
						//  'gid': 'QuantityType',
						//  'attributes': [],
						//  'options': {
						//  'mainService': 'estimateMainService',
						//  'dtoName': 'LineItems',
						//  'propertyFn': function(dtoItem){
						//   // if (dtoItem && dtoItem.DynamicQuantityColumns && dtoItem.DynamicQuantityColumns.length) {
						//   //
						//   // }else{
						//   return {
						//           name: 'QuantityType',
						//           domain: 'quantity',
						//           grid: {},
						//           detail: {}
						//          };
						//    // }
						//
						//     }
						//   }
						// },
						{
							'gid': 'LicCostGroupCatalog',
							'attributes': [],
							'options': {
								// //
								'mainService': 'estimateMainLineItemCostGroupService',
								'idProperty': 'CostGroupFk',

								// Column Configuration
								'dtoName': 'LicCostGroupCatalog',
								'propertyFn': function(dtoItem){ // DTO from Server to Process to UI Configuration
									let name = dtoItem.DescriptionInfo.Translated || dtoItem.DescriptionInfo.Description;
									return {
										name: name ? dtoItem.Code + '(' + name + ')' : dtoItem.Code,
										domain: 'lookup',
										sortable: true,
										required : false,
										grid: {
											editor: 'lookup',
											editorOptions: {
												directive: 'basics-cost-group-dialog',
												lookupOptions:{
													'showClearButton': true,
													'additionalColumns': true,
													'displayMember': 'Code',
													'addGridColumns': addColumns,
													'filterOptions': {
														'filterKey': 'estimate-prj-costgroup-filter',
														serverSide: true,
														fn: function (item) {
															return {
																costGroupType: 0,
																catalogIds: [dtoItem.Id],

																EstHeaderFk: item.RootItemId,
																Id: item.MainItemId
															};
														}
													},
												}
											},
											formatter: 'lookup',
											formatterOptions: {
												displayMember: 'Code',
												lookupType: 'CostGroup',
												version: 3

											}
										},
										detail: {
											type: 'directive',
											directive: 'basics-lookupdata-lookup-composite',
											options: {
												lookupDirective: 'basics-cost-group-dialog',
												descriptionMember: 'Code',
												lookupOptions: {
													'showClearButton': true,
													'additionalColumns': true,
													'displayMember': 'Code',
													'addGridColumns': addColumns,
													'filterOptions': {
														'filterKey': 'estimate-prj-costgroup-filter',
														serverSide: true,
														fn: function (item) {
															return {
																costGroupType: 0,
																catalogIds: [dtoItem.Id],

																EstHeaderFk: item.RootItemId,
																Id: item.MainItemId
															};
														}
													},
												}
											}
										}
									};
								}
							}
						},
						{
							'gid': 'PrjCostGroupCatalog',
							'attributes': [],
							'options': {
								'dtoName': 'PrjCostGroupCatalog',
								'propertyFn': function(dtoItem){

									let name = dtoItem.DescriptionInfo.Translated || dtoItem.DescriptionInfo.Description;
									return {
										name: name ? dtoItem.Code + '(' + name + ')' : dtoItem.Code,
										domain: 'lookup',
										sortable: true,
										required : false,
										grid: {
											editor: 'directive',
											editorOptions: {
												directive: 'basics-cost-group-dialog',
												lookupOptions:{
													'showClearButton': true,
													'additionalColumns': true,
													'displayMember': 'Code',
													'addGridColumns': addColumns
												}
											},
											formatter: 'lookup',
											formatterOptions: {
												displayMember: 'Code',
												lookupType: 'CostGroup'
											}
										},
										detail: {
											type: 'directive',
											directive: 'basics-lookupdata-lookup-composite',
											options: {
												lookupDirective: 'basics-cost-group-dialog',
												descriptionMember: 'Code',
												lookupOptions: {
													'showClearButton': true,
													'additionalColumns': true,
													'displayMember': 'Code',
													'addGridColumns': addColumns
												}
											}
										}
									};
								}
							}
						},
						{
							'gid': 'Characteristic',
							'attributes': [],
							'options': {
								'dtoName': 'CharFields',
								'propertyFn': function(dtoItem){
									let getFormatter = estimateMainCommonService.getFormatter(dtoItem);

									let editorOptions = getFormatter.editorOptions || {};
									editorOptions.bulkSupport = false;

									return {
										name: _.findLast(dtoItem.CharacteristicEntity.Code) === '.' ? _.trimEnd(dtoItem.CharacteristicEntity.Code, '.') : dtoItem.CharacteristicEntity.Code,
										mandatory: false,
										// readonly: true,
										domain: getFormatter.formatter,

										hidden: false,
										// bulkSupport: false,
										required: false,
										sortable: true,
										// isCharacteristicExpired: dtoItem.IsReadonly,

										grid: {
											bulkSupport: false,
											isCharacteristicExpired: dtoItem.IsReadonly,
											isCharacteristic: true,
											isCustomDynamicCol: true,
											columnId: dtoItem.Id,

											editorOptions: editorOptions,
											formatter: getFormatter.formatter,
											formatterOptions: getFormatter.formatterOptions
										},
										detail: {
											type: getFormatter.formatter,
											bulkSupport: false,
											isCharacteristicExpired: dtoItem.IsReadonly,
											isCharacteristic: true,
											isCustomDynamicCol: true,
											columnId: dtoItem.Id

										}

									};
								}
							}
						}
					],
					'overloads': {
						'notassignedcosttotal':{
							readonly: true
						}
					}
				};
			}

			function getTemplateNavigation() {
				return $injector.get('estimateMainService').getIsAssemblyTemplateNavigation();
			}

			function getEstimateMainResourceDetailLayout() {

				return {
					'fid': 'estimate.main.resource.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'change': 'change',
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['estresourcetypeshortkey', 'iteminfo', 'code', 'descriptioninfo', 'descriptioninfo1', 'basuomfk', 'bascurrencyfk', 'estcosttypefk', 'estresourceflagfk', 'sorting', 'budgetunit', 'budget', 'lgmjobfk', 'budgetdifference', 'escresourcecostunit', 'escresourcecosttotal', 'requisitionfk','workoperationtypefk', 'plantassemblytypefk','externalcode','gcbreakdowntypefk']
						},
						{
							'gid': 'ruleInfo',
							'attributes': ['ruletype', 'rulecode', 'ruledescription', 'evalsequencefk', 'elementcode', 'elementdescription']
						},
						{
							'gid': 'quantiyAndFactors',
							'attributes': ['quantitydetail', 'quantity', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2',
								'quantityfactor3', 'quantityfactor4', 'productivityfactordetail', 'productivityfactor', 'efficiencyfactordetail1', 'efficiencyfactor1',
								'efficiencyfactordetail2', 'efficiencyfactor2', 'quantityfactorcc', 'quantityreal', 'quantityinternal', 'quantityunittarget', 'quantitytotal',
								'quantityoriginal', 'co2source', 'co2sourcetotal', 'co2project', 'co2projecttotal']
						},
						{
							'gid': 'costFactors',
							'attributes': ['costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costfactorcc']
						},
						{
							'gid': 'costAndHours',
							'attributes': ['costunit', 'costunitsubitem', 'costunitlineitem', 'costunittarget', 'costunitoriginal', 'costtotal', 'costtotaloc', 'costuom', 'costtotalcurrency', 'hoursunit', 'hourfactor', 'hoursunitsubitem', 'hoursunitlineitem',
								'hoursunittarget', 'hourstotal', 'riskcostunit', 'riskcosttotal','basecostunit','basecosttotal', 'dayworkrateunit', 'dayworkratetotal']
						},
						{
							'gid': 'flags',
							'attributes': ['islumpsum', 'isdisabled', 'isindirectcost', 'isdisabledprc', 'isgeneratedprc', 'isfixedbudget','isfixedbudgetunit', 'iscost', 'isbudget', 'isestimatecostcode', 'isrulemarkupcostcode','ismanual']
						},
						{
							'gid': 'package',
							'attributes': ['packageassignments','prcstructurefk']
						},
						{
							'gid': 'comment',
							'attributes': ['commenttext', 'businesspartner']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						},
						{
							'gid': 'Allowance',
							'attributes': ['gc','ga','am','rp']
						}
						/* {
								'gid': 'currencies',
								'attributes':['costexchangerate1','costexchangerate2','currency1fk','currency2fk']
							} */
					],

					'overloads': {
						'iteminfo': {
							'readonly': true,
							'detail': {
								visible: false
							},
							'grid': {
								field: 'ItemInfo',
								formatter: function (row, cell, value, columnDef, entity) {
									entity.ItemInfo = $injector.get('estimateMainCommonService').buildResourceItemInfo(entity);
									return entity.ItemInfo;
								}
							}
						},
						'externalcode': {
							'readonly': true,
							'detail': {
								visible: true
							},
							'grid': {
								field: 'ExternalCode',
								'formatter': function (row, cell, value, columnDef, dataContext, plainText) {
									const estimateMainService = $injector.get('estimateMainService');
									const lineItem = estimateMainService.getSelected();
									if(lineItem){
										return lineItem.ExternalCode;
									}else {
										return value;
									}
								}
							}
						},
						'gcbreakdowntypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.generalcontractorbreakdowntype', 'Description'),
						'code': {
							navigator: {
								moduleName: '',
								'navFunc': function (fieldConfig, item) {
									if (item && item.EstResourceTypeFk) {
										switch (item.EstResourceTypeFk) {
											case estimateMainResourceType.CostCode: // cost codes
												if (item.MdcCostCodeFk) {
													$injector.get('platformModuleNavigationService').navigate({moduleName: 'basics.costcodes'}, {Id: item.MdcCostCodeFk}, fieldConfig.field);
												}
												if (item.ProjectCostCodeFk) {
													$injector.get('platformModuleNavigationService').navigate({moduleName: 'project.main-costcodes'}, {Id: item.ProjectCostCodeFk}, fieldConfig.field);
												}
												break;
											case estimateMainResourceType.Material: // material
												$injector.get('platformModuleNavigationService').navigate({moduleName: 'basics.material'}, item, fieldConfig.field);
												break;
											case estimateMainResourceType.Plant: // plant
											case estimateMainResourceType.PlantDissolved: // PlantDissolved
												let jobId = $injector.get('estimateMainService').getLgmJobId(item);
												let projectId = $injector.get('estimateMainService').getSelectedProjectId();
												fieldConfig.field = 'EstAssemblyFk';
												$injector.get('estimateMainService').getPlantEstimatePriceList(jobId, projectId).then(function (plantEstimatePriceFk) {
													$injector.get('platformModuleNavigationService').navigate({ moduleName: 'resource.plantestimate' },
														{
															plantFk: item.EtmPlantFk,
															estHeaderAssemblyFk: item.EstHeaderAssemblyFk,
															estAssemblyFk: item.EstAssemblyFk,
															plantEstimatePriceListFk: plantEstimatePriceFk
														}, fieldConfig.field);
												});
												break;
											case estimateMainResourceType.Assembly: // assembly
												let currentModuleName = mainViewService.getCurrentModuleName();
												if (currentModuleName === moduleName) {
													fieldConfig.field = 'EstAssemblyFk';
												}else{
													fieldConfig.targetIdProperty = 'EstAssemblyFk';
												}
												navigateToAssembly(fieldConfig, item);
												break;
											case estimateMainResourceType.SubItem: // subitem
												if (item.EstAssemblyFk) {
													fieldConfig.field = 'EstAssemblyFk';
													navigateToAssembly(fieldConfig, item);
												}
												break;
											case estimateMainResourceType.EquipmentAssembly: // Equipment Assembly
													let lineItem = $injector.get('estimateMainService').getItemById(item.EstLineItemFk);

													$injector.get('platformModuleNavigationService').navigate(
														{ moduleName: 'project.main-plantassembly' },
														{
															projectId: lineItem.ProjectFk,
															plantFk: item.EtmPlantFk,
															estHeaderAssemblyFk: item.EstHeaderAssemblyFk,
															estAssemblyFk: item.EstAssemblyFk
														}
													);
												break;
										}
									}
								},
								navModuleName: function (columnConfig, entity) {
									if (entity && entity.EstResourceTypeFk) {
										switch (entity.EstResourceTypeFk) {
											case estimateMainResourceType.CostCode: // cost codes
												if (entity.MdcCostCodeFk) {
													return 'basics.costcodes';
												}
												if (entity.ProjectCostCodeFk) {
													return 'project.costcodes.projectcostcodes';
												}
												break;
											case estimateMainResourceType.Material: // material
												return 'basics.material';
											case estimateMainResourceType.Plant: // plant
											case estimateMainResourceType.PlantDissolved: // PlantDissolved
												return 'cloud.desktop.moduleDisplayNamePlantEstimation';
											case estimateMainResourceType.Assembly: // assembly
												return 'estimate.assemblies.assembly';
											case estimateMainResourceType.SubItem:
												if (entity.EstAssemblyFk && getTemplateNavigation()) {
													return 'estimate.assemblies.assembly';
												}
												break;
											case estimateMainResourceType.EquipmentAssembly: // Equipment Assembly
												return 'project.main.equipassemblyTitle';
										}
									}
								},
								navShowNavigator: function (columnConfig, entity) {
									let allowAssemblyTempNav = getTemplateNavigation();
									if (entity.EstResourceTypeFk === estimateMainResourceType.SubItem && !entity.EstAssemblyFk) {
										return false;
									} else if((entity.EstResourceTypeFk === estimateMainResourceType.Assembly  || entity.EstResourceTypeFk === estimateMainResourceType.SubItem) && entity.EstAssemblyFk && !allowAssemblyTempNav) {
										return false;
									}
									return true;
								}
							},
							'detail': {
								type: 'directive',
								directive: 'estimate-main-resource-code-lookup',
								options: {
									showClearButton: true,
									lookupField: 'Code',
									gridOptions: {
										multiSelect: false,
										showDayworkRate:true
									},
									isTextEditable: true,
									grid: false
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions:{
										showClearButton: true,
										directive: 'estimate-main-resource-code-lookup',
										lookupField: 'Code',
										gridOptions: {
											multiSelect: true,
											showNote:true,
											showDayworkRate:true
										},
										isTextEditable: false,
										grid: true,
										isFastDataRecording: true
									},
									directive: 'estimate-main-resource-code-lookup',
								},
								formatter: function (row, cell, value, columnDef, entity, plainText) {
									if(!plainText) {
										let platformRuntimeDataService = $injector.get('platformRuntimeDataService');

										if (platformRuntimeDataService.hasError(entity, columnDef.field)) {
											let errorMessage = platformRuntimeDataService.getErrorText(entity, columnDef.field);
											value = _.isEmpty(value) ? '' : value;
											return `<div class="invalid-cell" title="${errorMessage}">${value}</div>`;
										} else {
											let resTypesRequired = [1, 2, 3, 4, 5];
											if ((resTypesRequired.indexOf(entity.EstResourceTypeFk) > -1) && (_.isNull(value) || _.isUndefined(value) || (_.isString(value) && !value.length))) {
												return '<div class="required-cell"></div>';
											}
										}
									} else {
										value = _.get(entity, columnDef.field, '');
									}
									let allowAssemblyTempNav = getTemplateNavigation();
									if (entity && entity.EstResourceTypeFk) {
										switch (entity.EstResourceTypeFk) {
											case estimateMainResourceType.CostCode: // cost codes
												if (entity.MdcCostCodeFk) {
													columnDef.navigator.moduleName = 'basics.costcodes';
												}
												if (entity.ProjectCostCodeFk) {
													columnDef.navigator.moduleName =  'project.costcodes.projectcostcodes';
												}
												break;
											case estimateMainResourceType.Material: // material
												columnDef.navigator.moduleName =  'basics.material';
												break;
											case estimateMainResourceType.Plant: // plant
												break;
											case estimateMainResourceType.Assembly: // assembly
												columnDef.navigator.moduleName =  'estimate.assemblies.assembly';
												break;
											case estimateMainResourceType.SubItem:
												if (entity.EstAssemblyFk && allowAssemblyTempNav) {
													columnDef.navigator.moduleName =  'estimate.assemblies.assembly';
												}
												break;
										}
									}
									if (entity.EstResourceTypeFk === estimateMainResourceType.SubItem && !entity.EstAssemblyFk){
										value = entity.Code;
									} else if((entity.EstResourceTypeFk === estimateMainResourceType.Assembly  || entity.EstResourceTypeFk === estimateMainResourceType.SubItem) && entity.EstAssemblyFk && !allowAssemblyTempNav) {
										value = entity.Code;
									} else if(entity.EstResourceTypeFk === estimateMainResourceType.Plant) {
										value = entity.Code;
									} else if(entity.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) {
										value = entity.Code;
									}else {
										value += $injector.get('platformGridDomainService').getNavigator(columnDef, entity);
									}
									return value;

								},
								formatterOptions: {
									dataServiceName: 'EstimateMainResourceCodeLookupDataService',
								}
							}
						},
						'descriptioninfo': {
							maxLength: 255
						},
						'descriptioninfo1': {
							maxLength: 255
						},
						'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'estimateMainJobLookupByProjectDataService',
							cacheEnable: true,
							additionalColumns: false,
							filter: function () {
								return $injector.get('estimateMainService').getSelectedProjectId();

							}
						}),
						'requisitionfk':{
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										lookupType: 'resourceRequisition',
										showClearButton: true,
										defaultFilter:{resourceFk: 'ResourceFk'}
									},
									directive: 'resource-requisition-lookup-dialog-new'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'resourceRequisition',
									version: 3,
									displayMember: 'Description'
								},
								width: 70
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'resource-requisition-lookup-dialog-new',
									descriptionMember: 'Description',
									displayMember: 'Code',
									showClearButton: true,
									lookupOptions:{
										defaultFilter:{resourceFk: 'ResourceFk'}
									}
								}
							}
						},
						'hourfactor': getRoundingDigitsConfig(true),
						'quantitydetail': detailsOverload,
						'escresourcecostunit': {'readonly': true},
						// fix issue #131800
						// 'isdisabledprc': {'readonly': true},
						'isgeneratedprc': {'readonly': true},
						'escresourcecosttotal': getRoundingDigitsConfig(true),
						'riskcosttotal': getRoundingDigitsConfig(true),
						'riskcostunit': getRoundingDigitsConfig(true),
						'quantityfactordetail1': detailsOverload,
						'quantityfactordetail2': detailsOverload,
						'productivityfactordetail': detailsOverload,
						'costfactordetail1': detailsOverload,
						'costfactordetail2': detailsOverload,
						'efficiencyfactordetail1': detailsOverload,
						'efficiencyfactordetail2': detailsOverload,
						'quantityunittarget': getRoundingDigitsConfig(true),
						'quantitytotal': getRoundingDigitsConfig(true),
						'quantityoriginal': getRoundingDigitsConfig(true),
						'costunittarget': getRoundingDigitsConfig(true),
						'costunitoriginal': getRoundingDigitsConfig(true),
						'costtotal': getRoundingDigitsConfig(true),
						'costtotaloc': getRoundingDigitsConfig(true),
						'costtotalcurrency': getRoundingDigitsConfig(true),
						'basecosttotal': getRoundingDigitsConfig(true),
						'basecostunit': getRoundingDigitsConfig(true),
						'hoursunit': getRoundingDigitsConfig(true),
						'hoursunittarget': getRoundingDigitsConfig(true),
						'hoursunitsubitem': getRoundingDigitsConfig(true),
						'hoursunitlineitem':getRoundingDigitsConfig(true),
						'hourstotal': getRoundingDigitsConfig(true),
						'quantityfactorcc': getRoundingDigitsConfig(true),
						'costfactorcc': getRoundingDigitsConfig(true),
						'quantityreal':getRoundingDigitsConfig(true),
						'quantityinternal': getRoundingDigitsConfig(true),
						'costunitsubitem': getRoundingDigitsConfig(true),
						'costunitlineitem': getRoundingDigitsConfig(false),
						'budget': getRoundingDigitsConfig(false),
						'budgetunit': getRoundingDigitsConfig(false),
						'budgetdifference': getRoundingDigitsConfig(true),
						'ruletype': {'readonly': true},
						'rulecode': {'readonly': true},
						'ruledescription': {'readonly': true},
						'elementcode': {'readonly': true},
						'elementdescription': {'readonly': true},
						'businesspartner': {'readonly': true},
						'dayworkratetotal': getRoundingDigitsConfig(true),
						'dayworkrateunit': getRoundingDigitsConfig(false),
						'quantityfactor1': getRoundingDigitsConfig(false),
						'quantityfactor2': getRoundingDigitsConfig(false),
						'quantityfactor3': getRoundingDigitsConfig(false),
						'quantityfactor4': getRoundingDigitsConfig(false),
						'costfactor1': getRoundingDigitsConfig(false),
						'costfactor2': getRoundingDigitsConfig(false),
						'productivityfactor':getRoundingDigitsConfig(false),
						'efficiencyfactor1': getRoundingDigitsConfig(false),
						'efficiencyfactor2': getRoundingDigitsConfig(false),
						'costunit': {
							'width': 180,
							'readonly': false,
							'detail': {
								'options': getDecimalPlacesOption()
							},
							'grid': {
								editorOptions: getDecimalPlacesOption(),
								formatterOptions: getDecimalPlacesOption(),
								'formatter': function (row, cell, value, columnDef, dataContext, plainText) {
									let domainService = $injector.get('platformGridDomainService');
									let outPutValue = domainService.formatter('money')(0, 0, value || dataContext[columnDef.field], columnDef);
									let formattedValue = plainText ? outPutValue : '<span class="flex-element text-right">' + outPutValue + '</span>';
									if(!plainText){
										let costUnit = domainService.formatter('money')(0, 0, dataContext.CostUnit, {});
										let costUnitOriginal = domainService.formatter('money')(0, 0, dataContext.CostUnitOriginal, {});
										let isActivate = $injector.get('estimateMainCommonService').getActivateEstIndicator();
										let isEstimate = $injector.get('estimateMainService').getIsEstimate();
										formattedValue = $injector.get('estimateMainCostUnitManageService').getCostUnitLookUpFormat(dataContext, columnDef, formattedValue);
										if (isEstimate && isActivate && dataContext.CostUnitOriginal !== undefined && costUnit !== costUnitOriginal) {
											formattedValue = '<div class="flex-box flex-align-center" style="color:red;">' + formattedValue + '</div>';
										} else {
											formattedValue = '<div class="flex-box flex-align-center">' + formattedValue + '</div>';
										}
									}
									return formattedValue;
								}
							}
						},
						'costuom': getRoundingDigitsConfig(true),
						'quantity': {
							'readonly': false,
							'detail': {
								'options': getDecimalPlacesOption()
							},
							'grid': {
								editorOptions: getDecimalPlacesOption(),
								formatterOptions: getDecimalPlacesOption(),
								formatter: function (row, cell, value, columnDef, dataContext, plainText) {
									let formattedValue = $injector.get('platformGridDomainService').formatter('quantity')(0, 0, value || dataContext[columnDef.field], columnDef);
									if(!plainText){
										let isActivate = $injector.get('estimateMainCommonService').getActivateEstIndicator();
										let isEstimate = $injector.get('estimateMainService').getIsEstimate();
										if (isEstimate && isActivate && dataContext.QuantityOriginal !== undefined && dataContext.Quantity !== dataContext.QuantityOriginal) {
											formattedValue = '<div class="text-right" style="color:red;">' + formattedValue + '</div>';
										} else {
											formattedValue = '<div class="text-right">' + formattedValue + '</div>';
										}
									}
									return formattedValue;
								}
							}
						},

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

						'estresourcetypeshortkey': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'estimate-main-resource-type-lookup',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'ShortKeyInfo.Translated'
									}
								},
								formatter: function (row, cell, value, columnDef, entity) {
									let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
									if (platformRuntimeDataService.hasError(entity, columnDef.field)) {
										let errorMessage = platformRuntimeDataService.getErrorText(entity, columnDef.field);
										value = _.isEmpty(value) ? '' : value;
										return `<div class="invalid-cell" title="${errorMessage}">${value}</div>`;
									}

									let resTypes = $injector.get('estimateMainResourceTypeLookupService').getList();

									let selectedItem = _.find(resTypes, function(resType){
										return entity.EstResourceTypeFk === resType.EstResourceTypeFk &&
											(entity.EstAssemblyTypeFk ? entity.EstAssemblyTypeFk === resType.EstAssemblyTypeFk : !_.isNumber(resType.EstAssemblyTypeFk)) &&
											(entity.EstResKindFk ? entity.EstResKindFk === resType.EstResKindFk : !_.isNumber(resType.EstResKindFk));});

									entity[columnDef.field] = selectedItem && selectedItem.ShortKeyInfo ? selectedItem.ShortKeyInfo.Translated : '';

									return entity[columnDef.field];
								},
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
									'isTextEditable': true,
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
							enableCache: true
							// readonly: true
						}),

						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}, {required: false}),


						'prcstructurefk': {
							'readonly': true,
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
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
						'gc': getAllowanceRoundingConfig(true, false),
						'ga': getAllowanceRoundingConfig(true, false),
						'am': getAllowanceRoundingConfig(true, false),
						'rp': getAllowanceRoundingConfig(true, false),
						'packageassignments': {
							'readonly': true,
							'width': 200,
							'grouping': {'generic': false}
						},
						'co2source': {'readonly': true},
						'co2sourcetotal':{'readonly': true},
						'co2projecttotal':{'readonly': true},
						'workoperationtypefk': $injector.get('resourceWotLookupConfigGenerator').provideWotLookupOverloadFilteredByPlantType(true,null,true,'estimate-filter'),
						'ismanual': {'readonly': true},
						'plantassemblytypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantassemblytype', null)
					},
					'addition': {
						grid: [
							{
								'afterId': 'estresourcetypeshortkey',
								'id': 'estresourcetypeshortkeydescription',
								'field': 'EstResourceTypeFkExtend',
								name: 'Description',
								width: 120,
								formatter: 'lookup',
								name$tr$: 'estimate.main.estResourceTypeDescription',
								'sortable': true,
								'readonly': true,
								'directive': 'estimate-main-resource-type-lookup',
								formatterOptions: {
									lookupType: 'resourcetype',
									displayMember: 'DescriptionInfo.Translated',
									dataServiceName: 'estimateMainResourceTypeLookupService'
								}
							}
						]
					}

				};
			}

			function getStandardAllowancesDetailLayout() {
				return {
					fid: 'estimate.main.estimateMainStandardAllowancesDetail',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['isactive', 'code', 'descriptioninfo', 'mdcallowancetypefk', 'mdcmarkupcalctypefk', 'isonestep', 'isbalancefp',
								'quantitytypefk','markupga','markuprp','markupam','mdcallareagrouptypefk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'code': {
							grid: {
								editor: 'directive',
								formatter: 'code',
								required: true,
								editorOptions: {
									showClearButton: true,
									directive: 'estimate-main-allowance-code-lookup',
									lookupField: 'Code',
									gridOptions: {
										multiSelect: false
									},
									isTextEditable: true
								}
							}
						},
						'mdcmarkupcalctypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.markupcalculationtype', 'Description',{
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										$injector.get('estimateMainStandardAllowancesDataService').reCalculateWhenMarkUpCalcTypeChange(args);
									}
								}]
						}),
						'mdcallowancetypefk':basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.allowancetype', 'Description',{
							filterKey : 'AllowanceTypeChangeFilter',
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										let lookupItem = args.selectedItem;
										let allowance = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
										allowance.MdcAllowanceTypeFk = lookupItem.Id;
										allowance.MdcAllAreaGroupTypeFk = lookupItem.Id === 3 ? 1 : null;
										$injector.get('estStandardAllowancesCostCodeDetailDataService').refreshColumns('e4a0ca6ff2214378afdc543646e6b079',allowance);
									}
								}]}),
						'quantitytypefk':basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.quantitytype', 'Code', {filterKey: 'AllowanceFilter'}),
						'mdcallareagrouptypefk':basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.allareagrouptype', 'Code')
					}
				};
			}

			function getStandardAllowancesCostCodeDetailLayout() {
				return {
					fid: 'estimate.main.estimateMainStandardAllowancesDetail',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['mdccostcodefk', 'djctotal', 'gctotal', 'gaperc', 'rpperc', 'amperc','gcvalue','gavalue','amvalue','rpvalue','fmvalue','allowancevalue',
								'graperc','defmgraperc','finmgra','defmgcperc','finmgc','defmperc','finm','djctotalop','defmop','finmop']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'mdccostcodefk':{
							'grid': {
								editor: 'directive',
								editorOptions: {
									showClearButton: true,
									directive: 'estimate-main-master-project-cost-code-lookup',
									lookupField: 'Code',
									gridOptions: {
										multiSelect: false,
										showDayworkRate: true
									},
									isTextEditable: false,
									grid: true
								},
								formatter: 'lookup',
								formatterOptions:{
									lookupType: 'estmasterprojectcostcode',
									dataServiceName: 'estimateMainOnlyCostCodeAssignmentDetailLookupDataService',
									displayMember: 'Code'
								}
							},
						},
						'djctotal':{
							readonly: true
						},
						'gctotal':{
							readonly: true
						},
						'graperc':{
							readonly: true
						},
						'finmgra':{
							readonly: true
						},
						'finm':{
							readonly: true
						},
						'djctotalop':{
							readonly: true
						},
						'finmop':{
							readonly: true
						},
						'finmgc':{
							readonly: true
						},
						'gcvalue':getAllowanceRoundingConfig(true, false),
						'gavalue':getAllowanceRoundingConfig(true, false),
						'amvalue':getAllowanceRoundingConfig(true, false),
						'rpvalue':getAllowanceRoundingConfig(true, false),
						'fmvalue':{
							readonly: true
						},
						'allowancevalue':{
							readonly: true
						},
						'defmop':{
							grid: {
								editorOptions: {
									allownull: true
								}
							}
						},
						'defmgraperc':{
							grid: {
								editorOptions: {
									allownull: true
								}
							}
						},
						'defmgcperc':{
							grid: {
								editorOptions: {
									allownull: true
								}
							}
						},
						'defmperc':{
							grid: {
								editorOptions: {
									allownull: true
								}
							}
						}
					},
					'addition': {
						grid: [
							{
								'afterId': 'mdccostcodefk',
								'id': 'mdccostcodeDescription',
								'field': 'MdcCostCodeFk',
								'name': 'Description',
								'width': 120,
								'formatter': 'lookup',
								'name$tr$': 'cloud.common.entityDescription',
								'readonly': true,
								'directive': 'estimate-main-master-project-cost-code-lookup',
								formatterOptions:{
									lookupType: 'estmasterprojectcostcode',
									dataServiceName: 'estimateMainOnlyCostCodeAssignmentDetailLookupDataService',
									displayMember: 'DescriptionInfo.Translated',
								}
							}
						]
					}
				};
			}

			return service;
		}
	]);
})();
