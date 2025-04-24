/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* jslint nomen:true */
	/* global _ */
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainCommonUIService', ['$injector', 'platformUIStandardConfigService', 'basicsLookupdataConfigGenerator', 'estimateMainTranslationService', 'boqMainCommonService',
		function ($injector, platformUIStandardConfigService, basicsLookupdataConfigGenerator, estimateMainTranslationService, boqMainCommonService) {

			function createUiService(attributes, filterInfos, notReadOnlyColumns, includeEstAggregator, customOptions, extendOptions) {

				let schemaMap = {
						'Id': {'domain': 'integer', 'mandatory': true},
						'Code': {'domain': 'code', 'mandatory': true, 'maxlen': 16},
						'PlantCode': {'domain': 'code', 'mandatory': true, 'maxlen': 16},
						'Description': {'domain': 'description'},
						'DescriptionInfo': {'domain': 'translation'},
						'BriefInfo': {'domain': 'translation'},
						'BasUomFk': {'domain': 'integer'},
						'UomFk': {'domain': 'integer'},
						'UoMFk': {'domain': 'integer'},
						'QuantityUoMFk': {'domain': 'integer'},
						'PlannedStart' :{'domain':'dateutc' },
						'PlannedFinish': {'domain':'dateutc'},
						'PlannedDuration': {'domain':'integer'},
						'PercentageCompletion' :{'domain' :'percent'},
						'SCurveFk':{'domain':'lookup'},
						'Quantity': {'domain': 'quantity'},
						'Reference': {'domain': 'description'},
						'Reference2': {'domain': 'description'},
						'BoqDivisionTypeFk': {'domain': 'integer'},
						'TotalOf': {'domain': 'description'},
						'Total': {'domain': 'money'},
						'CurUoM': {'domain': 'description'},
						'Rule': {'domain': 'imageselect'},
						'Param': {'domain': 'imageselect'},
						'Estimate': {'domain': 'comment'},
						'UoM': {'type': 'string'},
						'Currency': {'type': 'string'},
						'PrjCharacter': {'domain': 'description'},
						'WorkContent': {'domain': 'description'},
						'BoqItemFlagFk': {'domain': 'integer'},
						'BoqWicCatFk': {'domain': 'integer'},
						'UnitRateStrQty': {'domain': 'money'},
						'StructureQty': {'domain': 'quantity'},
						'StructureUom': {'domain': 'integer'},
						'Wic2AssemblyQuantity': {
							'type': 'integer',
							'readonly': 'true'
						},
						'WorkContentInfo': {
							'type': 'translation',
							'readonly': 'true',
							'grid': {
								'maxLength': 255,
								'width': 100
							}
						},
						'WicEstAssembly2WicFlagFk': {'domain': 'integer'},
						'CommentText': {'domain': 'comment'},

						'BoqLineTypeFk': {'domain': 'integer'},
						'BoqItemReferenceFk': {'domain': 'integer'},
						'BoqItemReferenceDescription': {'domain': 'description'},
						'BoqItemReferenceDesignDescription': {'domain': 'description'},
						'PrcItemEvaluationFk': {'domain': 'integer'},
						'PrcStructureFk': {'domain': 'directive'},
						'PrcStructureDescription': {'domain': 'description'},
						'MdcTaxCodeFk': {'domain': 'integer'},
						'TaxCodeDescription': {'domain': 'description'},
						'BpdAgreementFk': {'domain': 'integer'},
						'BasItemTypeFk': {'domain': 'integer'},
						'BasItemType2Fk': {'domain': 'integer'},
						'MdcMaterialFk': {'domain': 'integer'},
						'MdcCostCodeFk': {'domain': 'integer'},
						'MdcControllingUnitFk': {'domain': 'integer'},
						'ControllingUnitDescription': {'domain': 'description'},
						'LicCostGroup1Fk': {'domain': 'integer'},
						'LicCostGroup1Description': {'domain': 'description'},
						'LicCostGroup2Fk': {'domain': 'integer'},
						'LicCostGroup2Description': {'domain': 'description'},
						'LicCostGroup3Fk': {'domain': 'integer'},
						'LicCostGroup3Description': {'domain': 'description'},
						'LicCostGroup4Fk': {'domain': 'integer'},
						'LicCostGroup4Description': {'domain': 'description'},
						'LicCostGroup5Fk': {'domain': 'integer'},
						'LicCostGroup5Description': {'domain': 'description'},
						'PrjCostGroup1Fk': {'domain': 'integer'},
						'PrjCostGroup1Description': {'domain': 'description'},
						'PrjCostGroup2Fk': {'domain': 'integer'},
						'PrjCostGroup2Description': {'domain': 'description'},
						'PrjCostGroup3Fk': {'domain': 'integer'},
						'PrjCostGroup3Description': {'domain': 'description'},
						'PrjCostGroup4Fk': {'domain': 'integer'},
						'PrjCostGroup4Description': {'domain': 'description'},
						'PrjCostGroup5Fk': {'domain': 'integer'},
						'PrjCostGroup5Description': {'domain': 'description'},
						'PrjLocationFk': {'domain': 'integer'},
						'PrjLocationDescription': {'domain': 'description'},
						'LocationFk': {'domain': 'integer'},

						'DesignDescriptionNo': {'domain': 'description'},
						'WicNumber': {'domain': 'comment'},
						'FactorDetail': {'domain': 'comment'},
						'DiscountText': {'domain': 'comment'},
						'CommentContractor': {'domain': 'comment'},
						'CommentClient': {'domain': 'comment'},
						'Userdefined1': {'domain': 'description'},
						'Userdefined2': {'domain': 'description'},
						'Userdefined3': {'domain': 'description'},
						'Userdefined4': {'domain': 'description'},
						'Userdefined5': {'domain': 'description'},
						'ExternalCode': {'domain': 'description'},
						'ExternalUom': {'domain': 'description'},

						'AAN': {'domain': 'integer'},
						'AGN': {'domain': 'integer'},
						'Factor': {'domain': 'factor'},

						'Cost': {'domain': 'money'},
						'Correction': {'domain': 'money'},
						'Price': {'domain': 'money'},
						'DiscountedUnitprice': {'domain': 'money'},
						'DiscountedPrice': {'domain': 'money'},
						'Finalprice': {'domain': 'money'},
						'Finaldiscount': {'domain': 'money'},
						'Urb1': {'domain': 'money'},
						'Urb2': {'domain': 'money'},
						'Urb3': {'domain': 'money'},
						'Urb4': {'domain': 'money'},
						'Urb5': {'domain': 'money'},
						'Urb6': {'domain': 'money'},
						'UnitRateFrom': {'domain': 'money'},
						'UnitRateTo': {'domain': 'money'},
						'LumpsumPrice': {'domain': 'money'},
						'Discount': {'domain': 'money'},
						'TotalPrice': {'domain': 'money'},

						'QuantityAdj': {'domain': 'quantity'},
						'HoursUnit': {'domain': 'quantity'},
						'Hours': {'domain': 'quantity'},
						'TotalQuantity': {'domain': 'quantity'},

						'DiscountPercent': {'domain': 'percent'},
						'DiscountPercentIt': {'domain': 'percent'},

						'IsUrb': {'domain': 'boolean'},
						'IsLumpsum': {'domain': 'boolean'},
						'IsDisabled': {'domain': 'boolean'},
						'IsNotApplicable': {'domain': 'boolean'},
						'IsLeadDescription': {'domain': 'boolean'},
						'IsKeyitem': {'domain': 'boolean'},
						'IsSurcharged': {'domain': 'boolean'},
						'IsFreeQuantity': {'domain': 'boolean'},
						'IsUrFromSd': {'domain': 'boolean'},
						'IsFixedPrice': {'domain': 'boolean'},
						'IsNoMarkup': {'domain': 'boolean'},
						'IsCostItem': {'domain': 'boolean'},
						'Included': {'domain': 'boolean'},
						'IsDaywork': {'domain': 'boolean'},
						'LeadQuantityCalc': {'domain': 'boolean'},
						'NoLeadQuantity': {'domain': 'boolean'},
						'IsDurationQuantityActivity': {'domain': 'boolean'},
						// MultiCurrency
						'LocalCurrency': {'type': 'string'},
						'CostExchangeRate1': {'domain': 'money'},
						'CostExchangeRate2': {'domain': 'money'},
						'Currency1Fk': {'domain': 'directive'},
						'Currency2Fk': {'domain': 'directive'},
						'LocalCurrencyDescription': {'type': 'string'},
						'ForeignBudget1': {'domain': 'money'},
						'ForeignBudget2': {'domain': 'money'},
						// for resources summary
						'EstResourceTypeFk': {'domain': 'directive'},
						'EstCostTypeFk': {'domain': 'directive'},
						'EstResourceFlagFk': {'domain': 'directive'},
						'CostCodePortionsFk': {'domain': 'directive'},
						'CostCodeTypeFk': {'domain': 'directive'},
						// 'PrcStructureFk': {'type': 'string'},
						'PackageAssignments': {'domain': 'comment'},
						'IsIndirectCost': {'domain': 'boolean'},
						'IsGeneratedPrc': {'domain': 'boolean'},
						'LgmJobFk': {'domain': 'directive'},
						'BasCurrencyFk': {'domain': 'directive'},
						'CostFactor1': {'domain': 'factor'},
						'CostFactor2': {'domain': 'factor'},
						'CostFactorCc': {'domain': 'factor'},
						'QuantityFactor1': {'domain': 'factor'},
						'QuantityFactor2': {'domain': 'factor'},
						'QuantityFactor3': {'domain': 'factor'},
						'QuantityFactor4': {'domain': 'factor'},
						'QuantityFactorCc': {'domain': 'factor'},
						'ProductivityFactor': {'domain': 'factor'},
						'EfficiencyFactor1': {'domain': 'factor'},
						'EfficiencyFactor2': {'domain': 'factor'},
						'OverrideFactor': {'domain': 'factor'},
						'EstimatePrice': {'domain': 'money'},
						'AdjustPrice': {'domain': 'money'},
						'QuantitySummary': {'domain': 'quantity'},
						'CostSummary': {'domain': 'money'},
						'AdjQuantitySummary': {'domain': 'quantity'},
						'AdjCostSummary': {'domain': 'money'},
						'EstimateCostUnit': {'domain': 'money'},
						'AdjustCostUnit': {'domain': 'money'},
						'DetailsStack': {'domain': 'description'},
						'LineItemCode': {'type': 'string'},
						'RefLineItemCode': {'type': 'string'},
						'LineItemDescriptionInfo': {'type': 'translation'},
						'RefAssemblyCode': {'type': 'string'},
						'RefAssemblyDescriptionInfo': {'type': 'translation'},
						'AssemblyCode': {'type': 'string'},
						'AssemblyDescriptionInfo': {'type': 'translation'},
						'BoqRootRef': {'domain': 'directive'},
						'BoqItemFk': {'domain': 'directive'},
						'QuantityTotal': {'domain': 'money'},
						'CostTotal': {'domain': 'money'},

						'AQCostTotal': {'domain': 'money'},
						'RiskCostTotal': {'domain': 'money'},
						'EscalationCostTotal': {'domain': 'money'},
						'GrandTotal': {'domain': 'money'},
						'WQCostTotal': {'domain': 'money'},
						'DayWorkRateUnit': {'domain': 'money'},
						'DayWorkRateTotal': {'domain': 'money'},
						'AQDayWorkRateTotal': {'domain': 'money'},
						'WQDayWorkRateTotal': {'domain': 'money'},
						'AQBudget': {'domain': 'money'},
						'WQBudget': {'domain': 'money'},
						'AQRevenue': {'domain': 'money'},
						'WQRevenue': {'domain': 'money'},
						'AQMargin': {'domain': 'money'},
						'WQMargin': {'domain': 'money'},

						'CostUnitOriginal': {'domain': 'money'},
						'CostSummaryOriginal': {'domain': 'money'},
						'CostUnitDifference': {'domain': 'number'},
						'CostSummaryDifference': {'domain': 'number'},
						'CostSummaryOriginalDifference': {'domain': 'number'},

						'OrdQuantity': {'domain': 'quantity'},
						'PrevQuantity': {'domain': 'quantity'},
						'RemQuantity': {'domain': 'quantity'},

						'CalculateQuantitySplitting': {'domain': 'boolean'},
						'Delta': {'domain': 'money'},
						'DeltaUnit': {'domain': 'money'},

						'BudgetFixedUnit': {'domain': 'boolean'},
						'BudgetFixedTotal': {'domain': 'boolean'},
						'BudgetPerUnit': {'domain': 'money'},
						'BudgetTotal': {'domain': 'money'},
						'BudgetDifference': {'domain': 'money'},
						'BudgetMargin':{'domain':'money'},
						'Budget': {'domain': 'money'},
						'FromDJC': {'domain': 'percent'},
						'FromTJC': {'domain': 'percent'},
						'CO2SourceTotal':{'domain':'decimal'},
						'CO2ProjectTotal':{'domain':'decimal'},

						// price adjustment
						'AdjType': {'domain': 'string'},
						'TenderPrice': {'domain': 'money'},
						'DeltaA': {'domain': 'money'},
						'DeltaB': {'domain': 'money'},
						'ItemInfo': {'domain': 'string'},
						'EstimatedPrice': {'domain': 'money'},
						'AdjustmentPrice': {'domain': 'money'},
						'EpnaEstimagted': {'domain': 'money'},
						'StatusImage':{'domain':'image'},

						'InsertedAt': {'domain': 'history'},
						'InsertedBy': {'domain': 'history'},
						'UpdatedAt': {'domain': 'history'},
						'UpdatedBy': {'domain': 'history'},

						'Filter': {'domain': 'directive'},
						'Structure': {'domain': 'string'},
						'Count': {'domain': 'integer'},
						'CostModificationPercent': {'domain': 'percent'},
						'CostModificationAbsolute': {'domain': 'percent'}
					},
					basLayout = {
						'fid': 'estimate.main.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': []
							}
						],
						'overloads': {}
					},
					detailLayout = angular.copy(basLayout),
					schema = {},
					selfOption = {
						customSchemas: null,
						allowNullColumns: null,
						container: ''
					};

				angular.extend(selfOption, customOptions);
				angular.extend(schemaMap, selfOption.customSchemas);

				if (angular.isDefined(attributes) && angular.isArray(attributes)) {
					/* jshint -W074 */ // -> no cyclomatic complexity
					/* jshint -W071 */ // This function has too many statements
					_.forEach(attributes, function (item) {
						let lItem = item.toLowerCase();
						detailLayout.groups[0].attributes.push(lItem);
						detailLayout.overloads[lItem] = {'readonly': true};
						if (notReadOnlyColumns) {
							if (_.includes(notReadOnlyColumns, lItem) || _.includes(notReadOnlyColumns, item)) {
								detailLayout.overloads[lItem] = {'readonly': false};
							}
						}

						if (_.includes(selfOption.allowNullColumns, lItem) || _.includes(selfOption.allowNullColumns, item)) {
							detailLayout.overloads[lItem].grid = {
								editorOptions: {
									allownull: true
								}
							};
						}

						if(selfOption.container==='price-adjustment-total'&&lItem==='quantity') {
							detailLayout.overloads[lItem].grid = angular.extend({}, detailLayout.overloads[lItem].grid, {
								formatter: 'dynamic',
								editor: 'dynamic',
								domain: function (item, column) {
									let domain;
									if (column.field === 'Quantity') {
										switch (item.Id) {
											case 'EpNa':
												domain = 'description';
												break;
											case 'Ur':
												domain = 'image';
												column.formatterOptions = {
													imageSelector: 'estimateMainPriceAdjustmentTotalImageProcess'
												};
												break;
											default:
												domain = 'money';
										}
									}
									return domain;
								}
							});
						}

						if(lItem==='statusimage'){
							detailLayout.overloads[lItem].grid = angular.extend({}, detailLayout.overloads[lItem].grid, {
								field: 'image',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'estimateMainPriceAdjustmentImageProcess'
								}
							});
						}


						if (lItem === 'reference') {
							detailLayout.overloads[lItem] = {
								navigator: {
									moduleName: 'boq.main',
									'navFunc': function (triggerFieldOption, item) {
										triggerFieldOption.NavigatorFrom = 'BoqItemNavigator';
										$injector.get('estimateCommonNavigationService').navigateToBoq(item, triggerFieldOption);
									}
								},
								'readonly': true
							};
						}

						if (lItem === 'lineitemcode') {
							detailLayout.overloads[lItem] = {
								navigator: {
									moduleName: 'estimate.main.lineItemContainer',
									navFunc: function (triggerFieldOption, item) {
										let estimateMainService = $injector.get('estimateMainService');
										estimateMainService.activeLoadByNavigation();
										estimateMainService.navigateToLineItem(item, item.TriggerLineItemField);
									}
								},
								'isDynamic': true,
								'readonly': true
							};
						}

						if (lItem === 'reflineitemcode') {
							let lineitem = {};

							detailLayout.overloads[lItem] = {
								navigator: {
									moduleName: 'estimate.main',
									navFunc: function (triggerFieldOption, item) {
										lineitem.EstLineItemId = item.TriggerLineItemField.Id;
										if (filterInfos && !filterInfos.companyContext) {
											$injector.get('platformModuleNavigationService').navigate({moduleName: 'estimate.main-line-item'}, lineitem, item.TriggerLineItemField);
										} else {
											$injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.differentContextMsg', showOkButton: true});
										}
									}
								},
								'isDynamic': true,
								'readonly': true
							};

						}

						if (lItem === 'refassemblycode') {
							let assembly = {};
							detailLayout.overloads[lItem] = {
								navigator: {
									moduleName: '',
									navFunc: function (triggerFieldOption, item) {
										assembly.EstAssemblyFk = item.TriggerLineItemField.Id;
										triggerFieldOption.field = 'EstAssemblyFk';
										if (item.AssemblyType === 'PA' && filterInfos && !filterInfos.companyContext) {
											triggerFieldOption.ProjectFk = item.TriggerLineItemField.ProjectContextId;
											$injector.get('platformModuleNavigationService').navigate({moduleName: 'project.main-assembly'}, assembly, triggerFieldOption);
										} else if(item.AssemblyType === 'A' && filterInfos && !filterInfos.companyContext ) {
											$injector.get('estimateCommonNavigationService').navigateToAssembly(triggerFieldOption, assembly);
										} else {
											$injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.differentContextMsg', showOkButton: true});
										}
									},
									navModuleName: function (columnConfig, entity) {
										if (entity.AssemblyType === 'PA') {
											return 'estimate.assemblies.prjassembly';
										} else {
											return 'estimate.assemblies.assembly';
										}
									}
								},
								'isDynamic': true,
								'readonly': true
							};
						}

						if (lItem === 'rule') {
							detailLayout.overloads[lItem] = {
								'grid': {
									isTransient: filterInfos.isRuleParamTransient,
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
										itemServiceName: filterInfos.serviceName,
										itemName: filterInfos.itemName,
										serviceName: 'basicsCustomizeRuleIconService',
										RootServices: filterInfos.RootServices
									}
								}
							};
						}

						// region for resources summary
						if (lItem === 'estresourcetypefk') {
							detailLayout.overloads[lItem] = {
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'resourcetype',
										displayMember: 'ShortKeyInfo.Translated',
										dataServiceName: 'estimateMainResourceTypeLookupService'
									}
								},
								'readonly': true
							};
						}
						if (lItem === 'scurvefk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.scurve', 'Description');
						}

						if (lItem === 'estcosttypefk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costtype', 'Description');
						}
						if (lItem === 'costcodeportionsfk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodeportions', 'Description');
						}
						if (lItem === 'estresourceflagfk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.resourceflag', 'Description');
						}
						if (lItem === 'costcodetypefk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodetype', 'Description');
						}
						if (lItem === 'bascurrencyfk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true,
								readonly: true
							});
						}

						if (lItem === 'currency1fk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true,
								readonly: true
							});
						}
						if (lItem === 'currency2fk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true,
								readonly: true
							});
						}
						if (lItem === 'lgmjobfk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'logisticJobLookupByProjectDataService',
								cacheEnable: true,
								additionalColumns: false,
								readonly: true,
								filter: function () {
									return $injector.get('estimateMainService').getSelectedProjectId();

								}
							});
						}

						if (lItem === 'adjcostsummary') {
							detailLayout.overloads[lItem] = {
								'grid': {
									validator: 'onAdjCostSummaryChanged'
								}
							};
						}

						if (lItem === 'overridefactor') {
							detailLayout.overloads[lItem] = {
								'grid': {
									validator: 'onOverrideFactorChanged'
								}
							};
						}
						// endregion

						if (lItem === 'boqwiccatfk') {
							detailLayout.overloads[lItem] = {
								'readonly': true,
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
									}
								}
							};
						}

						if (lItem === 'param') {
							detailLayout.overloads[lItem] = {
								'grid': {
									isTransient: filterInfos.isRuleParamTransient,
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
										itemServiceName: filterInfos.serviceName,
										itemName: filterInfos.itemName,
										serviceName: 'estimateParameterFormatterService',
										RootServices: filterInfos.RootServices,
										showOverlayTemplate: true
									}
								}
							};
						}
						if (lItem.indexOf('uomfk') >= 0 && selfOption.container !== 'boq-driven-estimate') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								readonly: true
							});
						}
						if (lItem.indexOf('structureuom') >= 0) {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								additionalColumns: false,
								readonly: true
							});
						}
						if (lItem.indexOf('wicestassembly2wicflagfk') >= 0) {
							detailLayout.overloads[lItem] = angular.extend(basicsLookupdataConfigGenerator.provideGenericLookupConfig(
								'basics.lookup.takeovermode',
								'Description'), {readonly: true});
						}
						if (lItem === 'boqitemflagfk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'boqMainItemFlagLookupDataService',
								filterKey: 'boq-item-flag-filter',
								enableCache: true,
								additionalColumns: false,
								readonly: true
							});
						}
						if (lItem === 'plannedstart') {
							detailLayout.overloads[lItem] = {
								editor: 'dateutc',
								formatter: 'dateutc',
								readonly: true
							};
						}
						if (lItem === 'plannedfinish') {
							detailLayout.overloads[lItem] = {
								editor: 'dateutc',
								formatter: 'dateutc',
								readonly: true
							};
						}

						if (lItem === 'plannedDuration') {
							detailLayout.overloads[lItem] = {
								editor: 'integer',
								formatter: 'integer',
								bulkSupport: true
							};
						}


						if (lItem === 'PercentageCompletion') {
							detailLayout.overloads[lItem] = {
								editor: 'percent',
								formatter: 'percent'
							};
						}

						if (lItem === 'boqdivisiontypefk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'boqDivisionTypeLookupDataService',
								filterKey: 'boq-main-division-type-filter',
								enableCache: true,
								gridLess: true,
								additionalColumns: false,
								readonly: true
							});
						}

						if (lItem === 'basuomfk' && selfOption.container==='boq-driven-estimate') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								readonly: false
							});
						}

						let formatterConfig = {
							formatter: '',
							formatterOptions: {}
						};

						formatterConfig.formatter = 'lookup';
						if (lItem === 'boqlinetypefk') {
							setLookupFormatterOption('BoqLineType', 'Description', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'boqitemreferencefk') {
							setLookupFormatterOption('BoqItem', 'Reference', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'boqitemreferencedescription') {
							setLookupFormatterOption('BoqItem', 'BriefInfo.Description', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'boqitemreferencedesigndescription') {
							setLookupFormatterOption('BoqItem', 'Reference', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prcitemevaluationfk') {
							setLookupFormatterOption('PrcItemEvaluation', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prcstructurefk') {
							setLookupFormatterOption('prcstructure', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prcstructuredescription') {
							setLookupFormatterOption('prcstructure', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'mdctaxcodefk') {
							setLookupFormatterOption('TaxCode', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'taxcodedescription') {
							setLookupFormatterOption('TaxCode', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'bpdagreementfk') {
							setLookupFormatterOption('Agreement', 'Description', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'basitemtypefk') {
							formatterConfig.formatterOptions.displayMember = 'Description';
							formatterConfig.formatterOptions.lookupModuleQualifier = 'basics.lookup.boqitemtype';
							formatterConfig.formatterOptions.lookupSimpleLookup = true;
							formatterConfig.formatterOptions.valueMember = 'Id';
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'basitemtype2fk') {
							formatterConfig.formatterOptions.displayMember = 'Description';
							formatterConfig.formatterOptions.lookupModuleQualifier = 'basics.lookup.boqitemtype2';
							formatterConfig.formatterOptions.lookupSimpleLookup = true;
							formatterConfig.formatterOptions.valueMember = 'Id';
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'mdcmaterialfk') {
							setLookupFormatterOption('MaterialCommodity', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'mdccostcodefk') {
							setLookupFormatterOption('CostCode', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'mdccontrollingunitfk') {
							setLookupFormatterOption('controllingunit', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'controllingunitdescription') {
							setLookupFormatterOption('controllingunit', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup1fk') {
							setLookupFormatterOption('BasicsCostGroup1', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup1description') {
							setLookupFormatterOption('BasicsCostGroup1', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup2fk') {
							setLookupFormatterOption('BasicsCostGroup2', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup2description') {
							setLookupFormatterOption('BasicsCostGroup2', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup3fk') {
							setLookupFormatterOption('BasicsCostGroup3', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup3description') {
							setLookupFormatterOption('BasicsCostGroup3', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup4fk') {
							setLookupFormatterOption('BasicsCostGroup4', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup4description') {
							setLookupFormatterOption('BasicsCostGroup4', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup5fk') {
							setLookupFormatterOption('BasicsCostGroup5', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'liccostgroup5description') {
							setLookupFormatterOption('BasicsCostGroup5', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup1fk') {
							setLookupFormatterOption('projectCostGroup1', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup1description') {
							setLookupFormatterOption('projectCostGroup1', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup2fk') {
							setLookupFormatterOption('projectCostGroup2', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup2description') {
							setLookupFormatterOption('projectCostGroup2', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup3fk') {
							setLookupFormatterOption('projectCostGroup3', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup3description') {
							setLookupFormatterOption('projectCostGroup3', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup4fk') {
							setLookupFormatterOption('projectCostGroup4', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup4description') {
							setLookupFormatterOption('projectCostGroup4', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup5fk') {
							setLookupFormatterOption('projectCostGroup5', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjcostgroup5description') {
							setLookupFormatterOption('projectCostGroup5', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjlocationfk') {
							setLookupFormatterOption('ProjectLocation', 'Code', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'prjlocationdescription') {
							setLookupFormatterOption('ProjectLocation', 'DescriptionInfo.Translated', formatterConfig.formatterOptions);
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'description';
						if (lItem === 'designdescriptionno') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'wicnumber') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'factordetail') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'discounttext') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'commentcontractor') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'commentclient') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'CommentText') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'userdefined1') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'userdefined2') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'userdefined3') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'userdefined4') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'userdefined5') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'code';
						if (lItem === 'externalcode') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'uom';
						if (lItem === 'externaluom') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'integer';
						if (lItem === 'aan') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'agn') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'factor';
						if (lItem === 'factor') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'money';
						if (lItem === 'cost') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'correction') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'price') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'discountedunitprice') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'discountedprice') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'finalprice') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'finaldiscount') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'urb1') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'urb2') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'urb3') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'urb4') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'urb5') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'urb6') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'unitratefrom') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'unitrateto') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'lumpsumprice') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'discount') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'totalprice') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'quantity';
						if (lItem === 'quantityadj' && selfOption.container!=='boq-driven-estimate' ) {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'quantityadj' && selfOption.container==='boq-driven-estimate' ) {
							let translation = estimateMainTranslationService.getTranslationInformation(item);
							detailLayout.overloads[lItem] = {
								'grid': {
									id: item,
									name: translation.initial,
									field: item,
									formatter: formatterConfig.formatter,
									name$tr$: translation.location + '.' + translation.identifier,
									width: 100
								}
							};
						}

						if (lItem === 'hoursunit') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'hours') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'totalquantity') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'percent';
						if (lItem === 'discountpercent') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'discountpercentIt') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'boolean';
						if (lItem === 'isurb') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'islumpsum') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'isdisabled') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'isnotapplicable') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'isleaddescription') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						if (lItem === 'iskeyitem') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'issurcharged') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'isfreequantity') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'isurfromsd') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'isfixedprice') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'isnomarkup') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'iscostitem') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						formatterConfig.formatter = 'history';
						if (lItem === 'insertedat') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'insertedby') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'updatedat') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}
						if (lItem === 'updatedby') {
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						// resources summary
						if (lItem === 'detailsstack') {
							detailLayout.overloads[lItem] = {
								readonly: true,
								'grid': {
									formatter: function (row, cell, value, columnDef, dataContext){
										let classId = _.uniqueId('navigator_');
										let btn = '<button class="block-image tlb-icons ico-menu ' +classId+ '"  style="position: relative; margin-right: 3px"></button>';
										handleClick(classId, function (e) {
											let scope = $injector.get('$rootScope').$new();
											scope.entity = dataContext;
											$injector.get('estimateMainResourceDetailStackCommonService').openPopup(e, scope);
										});

										function handleClick(classId, func) {
											let timeoutId = setTimeout(function () {
												$('.' + classId).click(function (e) {
													e.stopPropagation();
													func(e);
												});
												clearTimeout(timeoutId);
											},0);
										}
										return '<div class="flex-box flex-align-center">' + btn + '</div>';

									}
								}
							};
						}
						if (lItem === 'costsummarydifference' || lItem === 'costunitdifference' || lItem === 'costsummaryoriginaldifference') {
							detailLayout.overloads[lItem] = {
								'readonly': true,
								'grid': {
									'formatter': function (row, cell, value, columnDef, dataContext, plainText) {
										let formattedValue = '';
										let dataValue = _.isNumber(value) ? value : (dataContext[item] ? dataContext[item] : null);
										formattedValue = $injector.get('platformGridDomainService').formatter('factor')(0, 0, dataValue, {});
										if (!plainText) {
											let isActivate = $injector.get('estimateMainCommonService').getActivateEstIndicator();
											if (isActivate && dataContext[item] !== undefined && dataContext[item] > 0) {
												formattedValue = '<div class="text-right" style="color:red;">' + formattedValue + '</div>';
											} else if (isActivate && dataContext[item] !== undefined && dataContext[item] < 0) {
												formattedValue = '<div class="text-right" style="color:green;">' + formattedValue + '</div>';
											} else {
												formattedValue = '<div class="text-right">' + formattedValue + '</div>';
											}
										}
										return formattedValue;
									}
								}
							};
						}

						if (lItem === 'boqitemfk') {
							detailLayout.overloads[lItem] = {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-boq-dialog',
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
										dataServiceName: 'estimateMainBoqLookupService'
									}
								},
								'readonly': true
							};
						}
						if (lItem === 'boqrootref') {
							detailLayout.overloads[lItem] = {
								'grid': {
									field: 'BoqItemFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estboqitems',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainBoqRootLookupService'
									}
								},
								'readonly': true
							};
						}

						if (lItem === 'locationfk') {
							detailLayout.overloads[lItem] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								filter: function (entity) {
									return entity ? entity.ProjectFk : -1;
								},
								cacheEnable: true,
								additionalColumns: true,
								readonly: true,
								addGridColumns: [{
									id: 'Description',
									field: 'DescriptionInfo',
									name: 'Description',
									width: 200,
									formatter: 'translation',
									name$tr$: 'cloud.common.entityDescription'
								}]
							});
						}

						if (lItem === 'iteminfo') {
							formatterConfig.formatter = function (row, cell, value, columnDef, entity) {
								entity.ItemInfo = boqMainCommonService.buildItemInfo(entity);
								return entity.ItemInfo;
							};
							insertLayout(item, lItem, formatterConfig, detailLayout);
						}

						schema[item] = schemaMap[item];
					});
				}

				if (filterInfos && filterInfos.userDefGroup && filterInfos.userDefGroup.length) {
					_.forEach(filterInfos.userDefGroup, function (group) {
						if (group.isUserDefText) {
							let textAttName = group.attName || 'userdefinedtext';

							addUserDefGroup(textAttName, group);
						}
					});
				}

				function setLookupFormatterOption(lookupType, displayMember, formatterOptions) {
					formatterOptions.lookupType = lookupType;
					formatterOptions.displayMember = displayMember;
				}

				function addUserDefGroup(attName, group) {
					let interFix = '0';
					if (group.noInfix) {
						interFix = '';
					}

					let formatterConfig = {
						formatter: group.formatter,
						formatterOptions: {}
					};

					for (let j = 1; j <= group.attCount; ++j) {
						let createdName = attName + interFix + j;
						let lname = createdName.toLocaleLowerCase();
						detailLayout.groups[0].attributes.push(lname);
						insertLayout(createdName, lname, formatterConfig, detailLayout);
						schema[createdName] = {'type': group.type};
						if (j === 9) {
							interFix = '';
						}
					}
				}

				function insertLayout(attribute, lItem, formatterConfig, detailLayout) {
					let translation = estimateMainTranslationService.getTranslationInformation(attribute);
					detailLayout.overloads[lItem] = {
						'grid': {
							id: attribute,
							name: translation.initial,
							field: attribute,
							formatter: formatterConfig.formatter,
							name$tr$: translation.location + '.' + translation.identifier,
							width: 100
						},
						readonly: true
					};

					if (attribute === 'BoqItemReferenceDescription') {
						detailLayout.overloads[lItem].grid.field = 'BoqItemReferenceFk';
					}
					if (attribute === 'BoqItemReferenceDesignDescription') {
						detailLayout.overloads[lItem].grid.field = 'BoqItemReferenceFk';
					}
					if (attribute === 'PrcStructureDescription') {
						detailLayout.overloads[lItem].grid.field = 'PrcStructureFk';
					}
					if (attribute === 'TaxCodeDescription') {
						detailLayout.overloads[lItem].grid.field = 'MdcTaxCodeFk';
					}
					if (attribute === 'ControllingUnitDescription') {
						detailLayout.overloads[lItem].grid.field = 'MdcControllingUnitFk';
					}
					if (attribute === 'LicCostGroup1Description') {
						detailLayout.overloads[lItem].grid.field = 'LicCostGroup1Fk';
					}
					if (attribute === 'LicCostGroup2Description') {
						detailLayout.overloads[lItem].grid.field = 'LicCostGroup2Fk';
					}
					if (attribute === 'LicCostGroup3Description') {
						detailLayout.overloads[lItem].grid.field = 'LicCostGroup3Fk';
					}
					if (attribute === 'LicCostGroup4Description') {
						detailLayout.overloads[lItem].grid.field = 'LicCostGroup4Fk';
					}
					if (attribute === 'LicCostGroup5Description') {
						detailLayout.overloads[lItem].grid.field = 'LicCostGroup5Fk';
					}
					if (attribute === 'PrjCostGroup1Description') {
						detailLayout.overloads[lItem].grid.field = 'PrjCostGroup1Fk';
					}
					if (attribute === 'PrjCostGroup2Description') {
						detailLayout.overloads[lItem].grid.field = 'PrjCostGroup2Fk';
					}
					if (attribute === 'PrjCostGroup3Description') {
						detailLayout.overloads[lItem].grid.field = 'PrjCostGroup3Fk';
					}
					if (attribute === 'PrjCostGroup4Description') {
						detailLayout.overloads[lItem].grid.field = 'PrjCostGroup4Fk';
					}
					if (attribute === 'PrjCostGroup5Description') {
						detailLayout.overloads[lItem].grid.field = 'PrjCostGroup5Fk';
					}
					if (attribute === 'PrjLocationDescription') {
						detailLayout.overloads[lItem].grid.field = 'PrjLocationFk';
					}
					if (attribute === 'InsertedAt') {
						detailLayout.overloads[lItem].grid.field = '__rt$data.history.insertedAt';
					}
					if (attribute === 'InsertedBy') {
						detailLayout.overloads[lItem].grid.field = '__rt$data.history.insertedBy';
					}
					if (attribute === 'UpdatedAt') {
						detailLayout.overloads[lItem].grid.field = '__rt$data.history.updatedAt';
					}
					if (attribute === 'UpdatedBy') {
						detailLayout.overloads[lItem].grid.field = '__rt$data.history.updatedBy';
					}

					if (formatterConfig.formatter === 'lookup') {
						detailLayout.overloads[lItem].grid.formatterOptions = formatterConfig.formatterOptions;
					}
				}

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					platformUIStandardConfigService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				if (includeEstAggregator) {
					$injector.get('estimateMainLeadQuantityAggregatorConfigService').extendEstAggregatorLayoutAndSchema(detailLayout, schema);
				}

				if(extendOptions && extendOptions.doBeforeCreateUIService){
					extendOptions.doBeforeCreateUIService(detailLayout, schema);
				}

				return new StructureUIStandardService(detailLayout, schema, estimateMainTranslationService);
			}

			return {
				createUiService: createUiService
			};
		}
	]);
})();
