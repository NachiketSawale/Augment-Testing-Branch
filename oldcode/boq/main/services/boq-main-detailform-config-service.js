(function (angular) {
	/* global _ */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('boqMainDetailFormConfigService', ['$injector', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'PlatformMessenger', 'boqMainCommonService',
		'accounting',
		'platformContextService',
		'platformLanguageService',
		'boqMainSplitQuantityConfigService', '$translate', 'platformRuntimeDataService', 'boqMainChangeService', 'boqMainProjectChangeService',
		function ($injector, basicsLookupdataConfigGenerator, platformSchemaService, PlatformMessenger, boqMainCommonService,
			accounting,
			platformContextService,
			platformLanguageService,
			boqMainSplitQuantityConfigService, $translate, platformRuntimeDataService, boqMainChangeService, boqMainProjectChangeService) {

			var service = {},
				detailsOverload = {
					'grid': {
						'formatter': function (row, cell, value, columnDef, dataContext) {
							var formattedValue = $injector.get('basicsCommonStringFormatService').detail2CultureFormatter(row, cell, value, columnDef, dataContext);
							return formattedValue;
						}
					}
				};

			var boqMainRoundingService = $injector.get('boqMainRoundingService');

			function getBillToConfig (option) {
				let defaultConfig = basicsLookupdataConfigGenerator.getDataServiceDefaultSpec({dataServiceName: 'boqMainBilltoLookupDataService'});
				let filteredColumns = _.filter(defaultConfig.columns, function(item) {
					return item.field !== 'QuantityPortion';
				});
				var config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'boqMainBilltoLookupDataService', //'boqMainBilltoCodeAndDescriptionLookupDataService',
					filter: function (/* item */) {
						return option.currentBoqMainService.getSelectedProjectId();
					},
					additionalColumns: true,
					showClearButton: true,
					columns: filteredColumns
				}, {
					gid: 'baseGroup',
					rid: 'PrjBillToId',
					label: 'Bill To',
					label$tr$: 'boq.main.BoqBillToFk',
					model: 'ProjectBillToFk',
					type: 'lookup'
				});

				// 'provideDataServiceLookupConfig' delivers a config object with the following set of properties: 'grid.editorOptions.lookupOptions'
				// -> add the new property addGridColumns to it to restrict the expanded split quantity grid only by the given below defined column.
				// As reference for this behavior have a look at 'platformUiConfigAdditionalColumnService' and its function 'addAdditionalColumnsTo'.
				/*
				if(_.has(config, 'grid.editorOptions.lookupOptions')) {
					config.grid.editorOptions.lookupOptions.addGridColumns = [{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						width: 200,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}];
				}
				*/

				return config;
			}

			function FormConfig(option) {
				var self = this;

				self.fid = 'boq.main';
				self.version = '0.1.0';
				self.addValidationAutomatically = true;
				self.showGrouping = true;
				self.groups = [
					{
						gid: 'BasicData',
						attributes: ['iteminfo', 'wicnumber', 'boqlinetypefk', 'boqdivisiontypefk', 'reference', 'reference2', 'externalcode', 'designdescriptionno', 'briefinfo', 'basuomfk',
							'externaluom', 'bpdagreementfk', 'stlno', 'basitemstatusfk', 'statuscomment', 'prcpriceconditionfk', 'deliverydate', 'copyinfo', 'projectbilltofk']
					},
					{
						gid: 'ItemFlag',
						attributes: ['boqitemflagfk']
					},
					{
						gid: 'ItemType',
						attributes: ['basitemtypefk', 'basitemtype2fk', 'aan', 'agn', 'basitemtype85fk']
					},
					{
						gid: 'FactorItem',
						attributes: ['factordetail', 'factor']
					},
					{
						gid: 'QuantityPrice',
						attributes: ['quantity', 'quantitydetail', 'quantityadj', 'quantityadjdetail', 'hoursunit', 'hours', 'cost', 'costoc', 'correction', 'correctionoc', 'price', 'priceoc', 'surchargefactor', 'pricegross', 'pricegrossoc', 'discountpercent', 'discountedunitprice', 'discountedprice', 'finalprice', 'finaldiscount', 'discountedunitpriceoc', 'discountedpriceoc', 'finalpriceoc', 'finaldiscountoc', 'finalgross', 'finalgrossoc', 'itemtotal', 'itemtotaloc', 'quantitymax', 'extraincrement', 'preescalation', 'extraincrementoc', 'preescalationoc', 'notsubmitted', 'included']
					},
					{
						gid: 'UrBreakdown',
						attributes: ['isurb', 'urb1', 'urb2', 'urb3', 'urb4', 'urb5', 'urb6', 'urb1oc', 'urb2oc', 'urb3oc', 'urb4oc', 'urb5oc', 'urb6oc']
					},
					{
						gid: 'UrFromTo',
						attributes: ['unitratefrom', 'unitrateto', 'unitratefromoc', 'unitratetooc']
					},
					{
						gid: 'DiscountLumpSum',
						attributes: ['islumpsum', 'lumpsumprice', 'discount', 'lumpsumpriceoc', 'discountoc', 'discountpercentit', 'discounttext']
					},
					{
						gid: 'ReferenceTo',
						attributes: ['boqitemreferencefk']
					},
					{
						gid: 'CharacteristicContent',
						attributes: ['prjcharacter', 'workcontent']
					},
					{
						gid: 'PrcItemEvaluationFk',
						attributes: ['prcitemevaluationfk']
					},
					{
						gid: 'PrcStructureFk',
						attributes: ['prcstructurefk','exsalestaxgroupfk']
					},
					{
						gid: 'AdditionsBoq',
						attributes: ['isdisabled', 'isnotapplicable', 'isleaddescription', 'iskeyitem', 'isdaywork', 'issurcharged', 'isfreequantity', 'isurfromsd']
					},
					{
						gid: 'AdditionsEstimate',
						attributes: ['isnomarkup','iscostitem','calculatequantitysplitting','usesubquantityprice','recordinglevel','isfixedprice','vobdirectcostperunit','vobdirectcostperunitoc','vobisindirectcostbalancing','vobisspecialindirectcostbalancing']
					},
					{
						gid: 'MasterDataAssignments',
						attributes: ['mdcmaterialfk', 'mdccostcodefk', 'mdccontrollingunitfk', 'mdctaxcodefk']
					},
					{
						gid: 'CommentContractor',
						attributes: ['commentcontractor']
					},
					{
						gid: 'CommentClient',
						attributes: ['commentclient']
					},
					{
						gid: 'userDefTextGroup',
						isUserDefText: true,
						attributes: ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'cosmatchtext']
					},
					{
						gid: 'ruleAndParam',
						attributes: ['rule', 'param', 'ruleformula', 'ruleformuladesc', 'divisiontypeassignment']
					},
					{
						gid: 'BudgetOnBoq',
						attributes: ['budgetperunit', 'budgettotal', 'budgetfixedunit', 'budgetfixedtotal', 'budgetdifference']
					},
					{
						gid: 'PrjChange',
						attributes: ['prjchangefk', 'prjchangestatusfk', 'prjchangestatusfactorbyreason', 'prjchangestatusfactorbyamount']
					},
					{
						gid: 'BoqRevenueTypeFk',
						attributes: ['boqrevenuetypefk', 'revenuepercentage']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				];
				self.overloads = {
					'reference': {
						'grid': {
							'validator': 'validateEntityReference'
						}
					},
					'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqUomLookupDataService',
						filterKey: 'boq-uom-filter',
						filter: function (boqItem) {
							var currentBoqHeader = null;
							if (boqItem) {
								currentBoqHeader = {BoqHeaderId: boqItem.BoqHeaderFk};
							}

							return currentBoqHeader;
						},
						highlightOnInit: true
					}),
					'basitemtypefk':  basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.boqitemtype',  'Description', {filterKey:'bas-item-type-filter'}),
					'basitemtype2fk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.boqitemtype2', 'Description', {filterKey:'bas-item-type2-filter'}),
					'basitemtype85fk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.itemtype85', 'Description'),
					'boqlinetypefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqLineTypeLookupDataService',
						filterKey: 'boq-line-type-filter',
						filter: function (item) {
							var currentLineTypeAndBoqHeader = null;
							if (item) {
								currentLineTypeAndBoqHeader = {};
								currentLineTypeAndBoqHeader.BoqLineTypeFk = item.BoqLineTypeFk;
								currentLineTypeAndBoqHeader.BoqHeaderFk = item.BoqHeaderFk;
							}

							return currentLineTypeAndBoqHeader;
						},
						enableCache: true,
						gridLess: true,
						additionalColumns: false,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: onSelectedBoqLineTypeChangedHandler
							}
						]
					}),
					'boqdivisiontypefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqDivisionTypeLookupDataService',
						filterKey: 'boq-main-division-type-filter',
						enableCache: true,
						gridLess: true,
						additionalColumns: false
					}),
					'boqitemreferencefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqRefItemLookupDataService',
						filter: function (item) {
							if (item) {
								return item.BoqHeaderFk + '&id=' + item.Id;
							}
						},
						filterKey: 'boq-ref-item-filter',
						columns: [
							{
								id: 'Reference',
								field: 'Reference',
								name: 'Reference',
								formatter: 'description',
								name$tr$: 'cloud.common.entityReference'
							},
							{
								id: 'Brief',
								field: 'BriefInfo.Description',
								name: 'Brief',
								formatter: 'description',
								name$tr$: 'cloud.common.entityBrief'
							},
							{
								id: 'DesignDescriptionNo',
								field: 'DesignDescriptionNo',
								name: 'Design Description Number',
								formatter: 'description',
								name$tr$: 'boq.main.DesignDescriptionNo'
							}
						]
					},
					{
						formatter: function (row, cell, value, columnDef, dataContext) {
							var text = '';
							var referencedBoqItem = null;
							if (dataContext && dataContext.BoqItemReferenceFk && dataContext.BoqItemReferenceFk > 0 && option.currentBoqMainService) {
								referencedBoqItem = option.currentBoqMainService.getBoqItemById(dataContext.BoqItemReferenceFk);

								if (!referencedBoqItem) {
									return text;
								}

								if (columnDef.id === 'boqitemreferencefkbrief') {
									text = referencedBoqItem.BriefInfo !== null ? referencedBoqItem.BriefInfo.Translated : '';
								} else if (!boqMainCommonService.isTextElementWithoutReference(referencedBoqItem)) {
									text = referencedBoqItem.Reference;
								} else if (boqMainCommonService.isDesignDescription(referencedBoqItem)) {
									text = referencedBoqItem.DesignDescriptionNo;
								}
							}

							return text;
						}
					}),
					'briefinfo': {
						isMultiLine: true
					},
					'boqitemflagfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqMainItemFlagLookupDataService',
						filterKey: 'boq-item-flag-filter',
						enableCache: true,
						additionalColumns: false
					}),
					'prcpriceconditionfk': {
						'detail': {
							'type': 'directive',
							'directive': 'boq-basics-Material-Price-Condition-Combobox',
							'options': {
								showClearButton: true,
								dataService: 'basicsMaterialPriceConditionDataServiceNew'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									dataService: 'basicsMaterialPriceConditionDataServiceNew'
								},
								directive: 'boq-basics-Material-Price-Condition-Combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcPricecondition',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'basitemstatusfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'boq-main-boq-item-status-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								dataServiceName: 'basicsCustomBoqItemStatusLookupDataService',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'boq-main-boq-item-status-combobox',
							'model': 'BasItemStatusFk',
							'options': {
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'bpdagreementfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'businesspartnerAgreementLookupDataService',
						enableCache: true,
						additionalColumns: false
					}),
					'prcitemevaluationfk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-prc-item-evaluation-combobox',
							'options': {
								'eagerLoad': true,
								'events': []
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'procurement-common-prc-item-evaluation-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcItemEvaluation',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'mdcmaterialfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-material-material-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'boq-main-material-type-default-estimate-filter',
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'boq-main-material-type-default-estimate-filter',
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												if(args.entity !== undefined)
												{
													args.entity.MdcMaterialFk = (_.isNil(args.selectedItem)) ? null: args.selectedItem.Id;
													if(option.currentBoqMainService) {
														let selectedBoqItem = option.currentBoqMainService.getSelected();
														boqMainChangeService.reactOnChangeOfBoqItem(selectedBoqItem, 'MdcMaterialFk', option.currentBoqMainService, boqMainCommonService);
													}
												}
											}
										}
									],
									isFastDataRecording: true
								},
								directive: 'basics-material-material-lookup'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code',
								dataServiceName: 'basicsMaterialFastRecordDataService'
							}
						}
					},
					'mdccostcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'boq-main-master-project-cost-code-lookup',
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
									showClearButton: true,
									isFastDataRecording: true,
								},
								directive: 'boq-main-master-project-cost-code-lookup'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqmasterprojectcostcode',
								displayMember: 'Code',
								dataServiceName: 'boqMainMasterProjectCostCodeService',
								childProp: 'CostCodes'
							}
						}
					},
					'mdctaxcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
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
					'exsalestaxgroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
						desMember: 'DescriptionInfo.Translated',
						additionalColumns: false,
						enableCache: true,
						showClearButton: true,
						filterKey: 'boqSaleTaxCodeByLedgerContext-filter'
					}),
					'rule': {
						'grid': {
							isTransient: true,
							editor: 'directive',
							editorOptions: {
								'directive': 'boq-rule-complex-lookup',
								lookupOptions: {
									'showClearButton': true,
									'showEditButton': false
								}
							},
							formatter: 'imageselect',
							formatterOptions: {
								dataServiceName: 'boqRuleFormatterService',
								dataServiceMethod: 'getItemByIdNew',
								serviceName: 'basicsCustomizeRuleIconService'
							}
						},
						'detail': {
							'type': 'directive',
							isTransient: true,
							'directive': 'boq-rule-complex-lookup',
							'options': {
								'isForBoq': true,
								'showClearButton': true,
								'showEditButton': false
							},
							formatter: 'imageselect',
							formatterOptions: {
								dataServiceName: 'boqRuleFormatterService',
								dataServiceMethod: 'getItemByIdNew',
								serviceName: 'basicsCustomizeRuleIconService'
							}
						}
					},
					'ruleformula': {
						readonly: true
					},
					'ruleformuladesc': {
						readonly: true
					},
					'param': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'estimate-param-complex-lookup',
								lookupOptions: {
									'showClearButton': true,
									'showEditButton': false
								}
							},
							formatter: 'imageselect',
							formatterOptions: {
								dataServiceName: 'estimateParameterFormatterService',
								dataServiceMethod: 'getItemByParamAsync',
								serviceName: 'estimateParameterFormatterService',
								itemServiceName: 'boqMainService',
								itemName: 'Boq'
							}
						},
						'detail': {
							type: 'directive',
							isTransient: true,
							directive: 'estimate-param-complex-lookup',
							options: {
								'showClearButton': true,
								'showEditButton': false,
								'itemName': 'Boq'
							},
							formatter: 'imageselect',
							formatterOptions: {
								dataServiceName: 'estimateParameterFormatterService',
								dataServiceMethod: 'getItemByParamAsync',
								serviceName: 'estimateParameterFormatterService',
								itemServiceName: 'boqMainService',
								itemName: 'Boq'
							}
						}
					},
					'divisiontypeassignment': {
						'grid': {
							formatter: function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
								var boqDivisionTypeAssignmentFormatterService = $injector.get('boqDivisionTypeAssignmentFormatterService');
								var divisionTypes = boqDivisionTypeAssignmentFormatterService.getDivisionTypes();
								var data = entity.DivisionTypeAssignment ? entity.DivisionTypeAssignment : [];
								value = _.map(data, function (item) {
									var divisionTypeItem = _.find(divisionTypes, {'Id': item.BoqDivisionTypeFk});
									return !divisionTypeItem ? '' : divisionTypeItem.Code;
								});
								value = _.uniq(value).join(', ');
								return value;
							},
							formatterOptions: {
								dataServiceName: 'boqDivisionTypeAssignmentFormatterService',
								displayMember: 'Code'
							},
							editor: 'directive',
							editorOptions: {
								directive: 'boq-main-division-type-assignment-lookup'
							}
						},
						'detail': {
							// formatter : function displayFormatter(value, lookupItem, displayValue, lookupConfig) {
							//   var boqDivisionTypeAssignmentFormatterService = $injector.get('boqDivisionTypeAssignmentFormatterService');
							//   var divisionTypes = boqDivisionTypeAssignmentFormatterService.getDivisionTypes();
							//   var data = displayValue || [];
							//   value = _.map(data, function(item){
							//      var divisionTypeItem = _.find(divisionTypes, {'Id' : item.BoqDivisionTypeFk});
							//      return !divisionTypeItem ? '' : divisionTypeItem.Code;
							//   }).join(', ');
							//   return value;
							// },
							formatterOptions: {
								dataServiceName: 'boqDivisionTypeAssignmentFormatterService',
								displayMember: 'Code'
							},
							directive: 'boq-main-division-type-assignment-lookup',
							editor: 'directive',
							editorOptions: {
								directive: 'boq-main-division-type-assignment-lookup'
							}
						}
					},
					'quantity': {
						'grid': {
							'formatter': function (row, cell, value, columnDef, entity, plainText) {
								return quantityFormatter(row, cell, value, columnDef, entity, plainText, option);
							}
						}
					},
					'quantitydetail': detailsOverload,
					'quantityadj': {
						'grid': {
							'formatter': function (row, cell, value, columnDef, entity, plainText) {
								return quantityFormatter(row, cell, value, columnDef, entity, plainText, option);
							}
						}
					},
					'quantityadjdetail': detailsOverload,
					'cosmatchtext': {readonly: true},
					'stlno': {readonly: true},
					// The following overloads are delivered by boqMainSplitQuantityConfigService.getAssignmentCols so have a look there and adjust.
					// 'mdccontrollingunitfk'
					// 'prcstructurefk'
					'agn': {
						'grid':   {'maxLength': 3 },
						'detail': {'maxLength': 3 }
					},
					'aan': {
						'grid':   {'maxLength': 3 },
						'detail': {'maxLength': 3 }
					},
					'finalprice': {
						'grid': {
							'formatter': function (row, cell, value, columnDef, entity, plainText) {
								return lumpsumFormatter(row, cell, value, columnDef, entity, plainText, option);
							}
						}
					},
					'itemtotal': {
						readonly: true,
						'grid': {
							'formatter': function (row, cell, value, columnDef, entity,plainText) {
								return lumpsumFormatter(row, cell, value, columnDef, entity, plainText, option);
							}
						}
					},
					'itemtotaloc': {
						readonly: true
					},
					'iteminfo': {
						'readonly': true,
						'grid': {
							'formatter': function (row, cell, value, columnDef, entity) {
								entity.ItemInfo = boqMainCommonService.buildItemInfo(entity);
								return entity.ItemInfo;
							}
						}

					},
					'surchargefactor': {
						readonly: true
					},
					'prjchangefk':       boqMainProjectChangeService.getPrjChangeConfig(),
					'prjchangestatusfk': boqMainProjectChangeService.getPrjChangeStatusConfig(),
					'recordinglevel': {
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: service.getRecordingLevelItems(),
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								items: service.getRecordingLevelItems(),
								valueMember: 'Id',
								displayMember: 'Description'
							}
						},
						detail: {
							type: 'select',
							options: {
								items: service.getRecordingLevelItems(),
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}
					},
					'factordetail': detailsOverload,
					'boqrevenuetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('boq.main.boqrevenuetypefk', 'Description', { customBoolProperty:'IS_PERCENTAGE' }),
					'projectbilltofk': getBillToConfig(option)
				};
			}

			var init = function () {

				//   // add translation is's to the column name
				//   angular.forEach(gridcols, function(value) {
				//      if (angular.isUndefined(value.name$tr$)) {
				//         value.name$tr$ = modulename + '.entity.' + value.field;
				//      }
				//   });
			};

			function onSelectedBoqLineTypeChangedHandler(e, args) {
				var boqMainWic2AssemblyService = $injector.get('boqMainWic2AssemblyService');
				boqMainWic2AssemblyService.onBoqSelectedLineTypeChanged(args.entity, args.previousItem, args.selectedItem);
				if (args && args.selectedItem !== null) {

					// fix defect that when change the boqItem line type to surchargeItemType4, the rule and parameter should be editable
					var isSurchargeItem4 = boqMainCommonService.isSurchargeItemType4(args.selectedItem.Id);
					platformRuntimeDataService.readonly(args.entity, [{field: 'Rule', readonly: !isSurchargeItem4}, {field: 'Param', readonly: !isSurchargeItem4}]);

					service.boqLineTypeChanged.fire(args.selectedItem.Id);
				}
			}

			function attachDecimalPlacesBasedOnRoundingConfigForFormConfig(formConfig, options) {
				let getDecimalPlacesOption = function getDecimalPlacesOption(){
					return {
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, options.currentBoqMainService);
						}
					};
				};

				// Atach decimalPlaces function to options object
				let getRoundingDigitsConfig = function getRoundingDigitsConfig(readonly, /* grouping, */ gridFormatter) {
					let config = {
						'readonly': readonly,
						'detail': {
							'options': getDecimalPlacesOption()
						},
						'grid': {
							editorOptions: getDecimalPlacesOption(),
							formatterOptions: getDecimalPlacesOption()
						}
					};

					if(_.isFunction(gridFormatter)) {
						config.grid.formatter = gridFormatter;
					}

					return config;
				};

				// Get information for columns that are to be rounded and have decimal places coming from the rounding config.
				let boqRoundedColumns2DetailTypes = options.currentBoqMainService.getBoqRoundedColumns2DetailTypes();
				if (_.isArray(boqRoundedColumns2DetailTypes)) {
					let columnsToBeRounded = _.map(boqRoundedColumns2DetailTypes, function(item) {
						return item.Field.toLowerCase();
					});

					let gridFormatter = null;
					let readonly = false;

					_.forEach(columnsToBeRounded, function(field) {
						let overload = formConfig.overloads[field];

						if(_.isObject(overload)) {
							if(!_.isObject(overload.detail)) {
								overload.detail = {options: {}}; // attach this property
							}
							else if(!_.isObject(overload.detail.options)) {
								overload.detail.options = {};  // attach this property
							}

							angular.extend(overload.detail.options, getDecimalPlacesOption());

							if(!_.isObject(overload.grid)) {
								overload.grid = {editorOptions: {}, formatterOptions: {}}; // attach this property
							}
							else {
								if(!_.isObject(overload.grid.editorOptions)) {
									overload.grid.editorOptions = {}; // attach this property
								}

								if(!_.isObject(overload.grid.formatterOptions)) {
									overload.grid.formatterOptions = {}; // attach this property
								}
							}

							angular.extend(overload.grid.editorOptions, getDecimalPlacesOption());
							angular.extend(overload.grid.formatterOptions, getDecimalPlacesOption());

						}
						else {
							formConfig.overloads[field] = getRoundingDigitsConfig(readonly, gridFormatter);
						}
					});
				}
			}

			service.attachDecimalPlacesBasedOnRoundingConfigForRowsOrColumns = function attachDecimalPlacesBasedOnRoundingConfigForRowsOrColumns(rowsOrColumns, isDetail, currentBoqMainService)
			{
				let getDecimalPlacesOption = function getDecimalPlacesOption(){
					return {
						decimalPlaces: function (columnDef, field) {
							return boqMainRoundingService.getUiRoundingDigits(columnDef,field, currentBoqMainService);
						}
					};
				};

				// Get information for columns that are to be rounded and have decimal places coming from the rounding config.
				let boqRoundedColumns2DetailTypes = currentBoqMainService.getBoqRoundedColumns2DetailTypes();
				if (_.isArray(boqRoundedColumns2DetailTypes)) {
					let columnsToBeRounded = _.map(boqRoundedColumns2DetailTypes, function(item) {
						return item.Field;
					});

					let gridFormatter = null;
					let readonly = false;

					_.forEach(rowsOrColumns, function(rowOrColumn) {
						if(_.isObject(rowOrColumn)) {
							let fieldName = isDetail ? rowOrColumn.model : rowOrColumn.field;
							// Check if this fieldName is amoung the columns to be rounded
							if(_.includes(columnsToBeRounded, fieldName)) {
								if (isDetail) {
									if (!_.isObject(rowOrColumn.options)) {
										rowOrColumn.options = {};  // attach this property
									}
									angular.extend(rowOrColumn.options, getDecimalPlacesOption());
								}
								else {
									if (!_.isObject(rowOrColumn.editorOptions)) {
										rowOrColumn.editorOptions = {}; // attach this property
									}

									if (!_.isObject(rowOrColumn.formatterOptions)) {
										rowOrColumn.formatterOptions = {}; // attach this property
									}

									angular.extend(rowOrColumn.editorOptions, getDecimalPlacesOption());
									angular.extend(rowOrColumn.formatterOptions, getDecimalPlacesOption());
								}
							}
						}
					});
				}
			};

			service.getFormConfig = function (options) {

				// For we're in a service here we return a reference of the local variable formConfig in this function when simply returning it.
				// When there are changes done to this config (i.e. chaging the readonly state of the rows in the form),
				// those changes are stored to this reference and survive the lifetime of the underlying controller.
				// To avoid this we return a deep copy of the form config so every time we get the same result when calling this function.
				var returnedFormConfig = new FormConfig(options); // angular.copy(formConfig);

				// Suppress bulk support for below given fields
				var fieldsToRemoveFromBulkSupport = ['reference','boqlinetypefk','agn','aan','recordinglevel','included','notsubmitted','percentagequantity','cumulativepercentage','totalquantity','totalprice'];
				if (options.currentBoqMainService && options.currentBoqMainService.isCrbBoq()) {
					fieldsToRemoveFromBulkSupport = fieldsToRemoveFromBulkSupport.concat('basitemtypefk','basitemtype2fk');
				}
				_.each(fieldsToRemoveFromBulkSupport, function (field) {
					if (!returnedFormConfig.overloads[field]) {
						returnedFormConfig.overloads[field] = {};
					}
					if (!returnedFormConfig.overloads[field].grid) {
						returnedFormConfig.overloads[field].grid = {};
					}
					returnedFormConfig.overloads[field].grid.bulkSupport = false;
				});

				// add assignment cols

				var attributes = [
					'prjlocationfk'
				];

				if (_.isObject(options) && _.isObject(options.currentBoqMainService)) {

					attachDecimalPlacesBasedOnRoundingConfigForFormConfig(returnedFormConfig, options);

					if (options.currentBoqMainService.getCallingContextType() === 'Wic') {
						attributes = _.without(attributes, 'prjlocationfk');

						var masterDataAssignmentsGroup = _.filter(returnedFormConfig.groups, {gid: 'MasterDataAssignments'});
						if (_.isArray(masterDataAssignmentsGroup) && masterDataAssignmentsGroup.length > 0) {
							masterDataAssignmentsGroup[0].attributes = _.without(masterDataAssignmentsGroup[0].attributes, 'mdccontrollingunitfk');
						}
					}
				}

				returnedFormConfig.groups.push({gid: 'Assignments', attributes: attributes});
				returnedFormConfig.overloads = angular.extend(returnedFormConfig.overloads, boqMainSplitQuantityConfigService.getAssignmentCols(options));

				return returnedFormConfig;

			};

			service.getTransientFields = function getTransientFields() {
				return ['PrevQuantity', 'OrdQuantity', 'BilledQuantity', 'InstalledQuantity', 'RemQuantity', 'TotalQuantity', 'TotalQuantityAccepted', 'TotalIQAccepted', 'PrevRejectedQuantity', 'TotalRejectedQuantity', 'TotalPrice', 'TotalPriceOc', 'TotalHours', 'Performance', 'PreviousPrice', 'PercentageQuantity', 'CumulativePercentage', 'PreEscalationTotal', 'ItemTotalEditable', 'ItemTotalEditableOc'];
			};


			service.iQTotalQuantityFormatter = function (row, cell, value, columnDef, entity, plainText) {

				var culture = platformContextService.culture();
				var cultureInfo = platformLanguageService.getLanguageInfo(culture);
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				let platformObjectHelper = $injector.get('platformObjectHelper');
				let precision = _.get(columnDef, 'formatterOptions.decimalPlaces', _.get(columnDef, 'editorOptions.decimalPlaces', 3));

				if(_.isFunction(precision)) {
					precision = precision(columnDef, columnDef.field);
				}

				if(_.isNil(precision)) {
					precision = 3;
				}

				if (!_.isNumber(value)) {
					value = platformObjectHelper.getValue(entity, columnDef.field);
				}
				value = accounting.formatNumber(value, precision, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);


				if (platformRuntimeDataService.isHideContent(entity, columnDef.field)) {
					return ' ';
				}

				if(plainText) {
					return value;
				}

				var outValue = '<div class="flex-box flex-align-center">';

				if (entity[columnDef.field] > entity.OrdQuantity) { // field is IQTotalQuantity or BQTotalQuantity
					outValue += '<i class="block-image control-icons ico-exceed" title="' + $translate.instant('boq.main.IQuantityExceedsContractedQuantity ') + '"></i>';
				}

				outValue += '<span class="flex-element text-right">' + value + '</span>' + '</div>';

				return outValue;
			};

			service.totalQuantityFormatter = function (row, cell, value, columnDef, entity, plainText) {

				var culture = platformContextService.culture();
				var cultureInfo = platformLanguageService.getLanguageInfo(culture);
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');

				let platformObjectHelper = $injector.get('platformObjectHelper');
				let precision = _.get(columnDef, 'formatterOptions.decimalPlaces', _.get(columnDef, 'editorOptions.decimalPlaces', 3));

				if(_.isFunction(precision)) {
					precision = precision(columnDef, columnDef.field);
				}

				if(_.isNil(precision)) {
					precision = 3;
				}

				if (!_.isNumber(value)) {
					value = platformObjectHelper.getValue(entity, columnDef.field);
				}
				value = accounting.formatNumber(value, precision, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);

				if (platformRuntimeDataService.isHideContent(entity, columnDef.field)) {
					return ' ';
				}

				if(plainText) {
					return value;
				}

				var outValue = '<div class="flex-box flex-align-center">';
				// var moduleName = option.currentBoqMainService.getModuleName();
				// if (moduleName === 'procurement.pes' || moduleName === 'sales.wip')
				// {
				if (entity.OrdQuantity && entity.TotalQuantity > entity.OrdQuantity) {
					outValue += '<i class="block-image control-icons ico-exceed" title="' + $translate.instant('boq.main.QuantityExceedsContractedQuantity ') + '"></i>';
				}
				// }

				outValue += '<span class="flex-element text-right">' + value + '</span>' + '</div>';
				return outValue;
			};

			service.cumulativePercentageFormatter  =  function (row, cell, value, columnDef, entity, plainText) {

				var culture = platformContextService.culture();
				var cultureInfo = platformLanguageService.getLanguageInfo(culture);
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				value = accounting.formatNumber(value, 3, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);

				if (platformRuntimeDataService.isHideContent(entity, columnDef.field)) {
					return ' ';
				}

				if(plainText) {
					return value;
				}

				var outValue = '<div class="flex-box flex-align-center">';

				if(columnDef.field === 'CumulativePercentage') {
					if (entity.CumulativePercentage && entity.CumulativePercentage > 100) {
						outValue += '<i class="block-image control-icons ico-exceed" title="' + $translate.instant('boq.main.IQuantityExceedsContractedQuantity ') + '"></i>';
					}
				}

				if(columnDef.field ==='BQCumulativePercentage') {
					if (entity.BQCumulativePercentage && entity.BQCumulativePercentage > 100) {
						outValue += '<i class="block-image control-icons ico-exceed" title="' + $translate.instant('boq.main.IQuantityExceedsContractedQuantity ') + '"></i>';
					}
				}

				outValue += '<span class="flex-element text-right">' + value + '</span>' + '</div>';
				return outValue;
			};

			service.initQuantityFormatter = function (row, cell, value, columnDef, entity, plainText) {
				return quantityFormatter(row, cell, value, columnDef, entity, plainText);
			};

			function quantityFormatter(row, cell, value, columnDef, entity, plainText/* , option */) {

				var culture = platformContextService.culture();
				var cultureInfo = platformLanguageService.getLanguageInfo(culture);
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				var platformObjectHelper = $injector.get('platformObjectHelper');
				let precision = _.get(columnDef, 'formatterOptions.decimalPlaces', _.get(columnDef, 'editorOptions.decimalPlaces', 3));

				if(_.isFunction(precision)) {
					precision = precision(columnDef, columnDef.field);
				}

				if(_.isNil(precision)) {
					precision = 3;
				}

				if (!_.isNumber(value)) {
					value = platformObjectHelper.getValue(entity, columnDef.field);
				}
				value = accounting.formatNumber(value, precision, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);

				if (platformRuntimeDataService.isHideContent(entity, columnDef.field)) {
					return ' ';
				}

				if (plainText) {
					return value;
				}

				var outValue = '<div class="flex-box flex-align-center">';
				if (entity.HasSplitQuantities) {
					outValue += '<i class="block-image control-icons ico-split-quantity" title="' + $translate.instant('boq.main.QuantitySplit') + '"></i>';
				}
				outValue += '<span class="flex-element text-right">' + value + '</span>' + '</div>';
				return outValue;
			}

			var _listOfFields = null;
			service.getListOfFields = function getListOfFields(includeTransientFields) {
				// Extract a list of the currently configured fields and return it as an array.
				var formConfig = new FormConfig();
				var fieldList = null;
				if (_listOfFields === null) {   // populate cached list
					_listOfFields = [];
					angular.forEach(formConfig.groups, function (item) {
						if (item.attributes && item.attributes.length > 0) {
							_listOfFields = _listOfFields.concat(item.attributes);
						}
					});

					var boqItemSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'BoqItemDto',
						moduleSubModule: 'Boq.Main'
					});

					_.each(Object.getOwnPropertyNames(boqItemSchema.properties), function (prop) { // jshint ignore:line
						var ix = _listOfFields.indexOf(prop.toLowerCase());
						if (ix !== -1) {
							_listOfFields[ix] = prop;
						}
					});
				}

				fieldList = angular.copy(_listOfFields);

				if (includeTransientFields) {
					// Add transient fields to allFields it they are not already included
					_.each(service.getTransientFields(), function (field) {
						if (fieldList.indexOf(field) === -1) {
							fieldList.push(field);
						}
					});
				}

				return fieldList;
			};

			function determineAndCallDomainFormatter(row, cell, value, columnDef, entity, plainText, defaultDomain) {
				var platformSchemaService = $injector.get('platformSchemaService');
				var boqItemSchema = platformSchemaService.getSchemaFromCache({typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'});
				var domainType = _.isObject(boqItemSchema) ? boqItemSchema.properties[columnDef.field].domain : defaultDomain;
				var platformGridDomainService = $injector.get('platformGridDomainService');
				var domainFormatter = platformGridDomainService.formatter(domainType);

				return domainFormatter(row, cell, value, columnDef, entity, plainText);
			}

			/***
			 * Description: This function adds round brackets to child elements of Item Total &
			 Final Price columns when Lumpsum flag is set to parent elements.
			 ***/
			function lumpsumFormatter(row, cell, value, columnDef, entity, plainText, option) {
				let formattedValue = determineAndCallDomainFormatter(row, cell, value, columnDef, entity, plainText, 'money');

				if(_.isEmpty(formattedValue) || (_.isString(formattedValue) && _.isEmpty(formattedValue.trim()))) {
					return '';
				}

				let parentChain = [];
				let found = null;
				let boqRootItem = option.currentBoqMainService.getRootBoqItem();
				if(_.isObject(boqRootItem) && boqMainCommonService.isRoot(boqRootItem)) {
					option.currentBoqMainService.getParentChainOf(entity, parentChain, null);
					parentChain = _.unionWith(parentChain, [boqRootItem], _.isEqual);
					found = !_.isEmpty(parentChain) ? _.find(parentChain, function (item) {
						return item.Id !== entity.Id && item.IsLumpsum;
					}) : null;
				}

				if(_.isObject(found)) {
					formattedValue = '(' + formattedValue + ')';
				}

				// Put some html around the formatted value to force right-alignment of the value.
				formattedValue = '<div class="flex-box flex-align-center"><span class="flex-element text-right">' + formattedValue + '</span></div>';
				return formattedValue;
			}

			service.getRecordingLevelItems = function getRecordingLevelItems() {
				return [
					{Id: 0, Description: $translate.instant('boq.main.reclevelpos')},
					{Id: 1, Description: $translate.instant('boq.main.reclevellineitem')}
				];
			};

			service.boqLineTypeChanged = new PlatformMessenger();

			init();

			return service;
		}

	]);

})(angular);
