/**
 * Created by Frank Baedeker on 2020/10/23.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeLookupDomainConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides configuration of all icon columns in instance table
	 */
	angular.module(moduleName).service('basicsCustomizeLookupDomainConfigurationService', BasicsCustomizeLookupDomainConfigurationService);

	BasicsCustomizeLookupDomainConfigurationService.$inject = ['_', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'basicsCustomizeLookupConfigurationService', 'basicsCustomizeTypeDataService', 'basicsCustomizeStatusTransitionConfigurationService'];

	function BasicsCustomizeLookupDomainConfigurationService(_, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService,
		basicsCustomizeLookupConfigurationService, basicsCustomizeTypeDataService, basicsCustomizeStatusTransitionConfigurationService) {
		var self = this;
		var selfData = {
			filterName: {}
		};

		function filterCategoryByRubric(item, rubricId) {
			return item.RubricFk === rubricId;
		}

		function filterRejectionReasonByLedgerContext(taxCode, rejection) {
			return taxCode.LedgerContextFk === rejection.LedgerContextFk;
		}

		function filterBillingSchemeByLedgerContext(billScheme, settlementLCType) {
			return billScheme.LedgerContextFk === settlementLCType.LedgerContextFk;
		}

		var filters = [
			{
				key: 'rubricCategoryByChange-filter',
				fn: function filterCategoryByChange(item) {
					return filterCategoryByRubric(item, 14);
				}
			},
			{
				key: 'rubricCategoryByDefect-filter',
				fn: function filterCategoryByCustomerBilling(item) {
					return filterCategoryByRubric(item, 73);
				}
			},
			{
				key: 'rubricCategoryByCustomerBilling-filter',
				fn: function filterCategoryByCustomerBilling(item) {
					return filterCategoryByRubric(item, 7);
				}
			},
			{
				key: 'rubricCategoryByConstructionSystemInstance-filter',
				fn: function filterCategoryByCosSysInst(item) {
					return filterCategoryByRubric(item, 60);
				}
			},
			{
				key: 'rubricCategoryByLogisticJob-filter',
				fn: function filterCategoryByLogisticJob(item) {
					return filterCategoryByRubric(item, 35);
				}
			},
			{
				key: 'rubricCategoryByLogisticSettlement-filter',
				fn: function filterCategoryByLogisticSettlement(item) {
					return filterCategoryByRubric(item, 36);
				}
			},
			{
				key: 'rubricCategoryByLogisticDispatch-filter',
				fn: function filterCategoryByLogisticDispatch(item) {
					return filterCategoryByRubric(item, 34);
				}
			},
			{
				key: 'rubricCategoryByLogisticJobCardStatus-filter',
				fn: function filterCategoryByLogisticDispatch(item) {
					return filterCategoryByRubric(item, 37);
				}
			},
			{
				key: 'rubricCategoryByInvoiceReconciliation-filter',
				fn: function filterCategoryByInvoiceReconciliation(item) {
					return filterCategoryByRubric(item, 28);
				}
			},
			{
				key: 'rubricCategoryByMeeting-filter',
				fn: function filterCategoryByInvoiceReconciliation(item) {
					return filterCategoryByRubric(item, 97);
				}
			},
			{
				key: 'rubricCategoryByProjectDocument-filter',
				fn: function filterCategoryByProjectDocument(item) {
					return filterCategoryByRubric(item, 40);
				}
			},
			{
				key: 'rubricCategoryByProject-filter',
				fn: function filterCategoryByProject(item) {
					return filterCategoryByRubric(item, 3);
				}
			},
			{
				key: 'rubricCategoryBySchedule-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 32);
				}
			},
			{
				key: 'rubricCategoryByQuantityTakeOff-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 6);
				}
			},
			{
				key: 'rubricCategoryBySubledgerC-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 10);
				}
			},
			{
				key: 'rubricCategoryBySubledgerS-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 11);
				}
			},
			{
				key: 'rubricCategoryByPpsItemStatus-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 84);
				}
			},
			{
				key: 'rubricCategoryByProductionPlanning-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 75);
				}
			},
			{
				key: 'rubricCategoryByPpsItemType-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 84);
				}
			},
			{
				key: 'rubricCategoryByPpsPhaseType-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 102);
				}
			},
			{
				key: 'rubricCategoryByPpsProcessType-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 101);
				}
			},
			{
				key: 'rubricCategoryByPpsUpstreamItemStatus-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 86);
				}
			},
			{
				key: 'rubricCategoryByEngDrawingType-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 77);
				}
			},
			{
				key: 'rubricCategoryByEngType-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 77);
				}
			},
			{
				key: 'rubricCategoryByEngTaskStatus-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 77);
				}
			},
			{
				key: 'rubricCategoryByTrsBundleStatus-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 76);
				}
			},
			{
				key: 'rubricCategoryByTrsBundleType-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 76);
				}
			},
			{
				key: 'rubricCategoryByTrsPgkType-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 76);
				}
			},
			{
				key: 'rubricCategoryByBasSite-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 71);
				}
			},
			{
				key: 'prcConfigurationByRubric-filter',
				serverSide: true,
				fn: function () {
					return 'RubricFk = 31';
				}
			},
			{
				key: 'invoceRejectionReasonByLedgerContext-filter',
				fn: filterRejectionReasonByLedgerContext
			},
			{
				key: 'controllingCostCode-filter',
				fn: function filterControllingCostCodeContext(item, context) {
					return item.MdcContextFk === context.ContextFk;
				}
			},
			{
				key: 'billingSchemeByLedgerContext-filter',
				fn: filterBillingSchemeByLedgerContext
			},
			{
				key: 'accountingToMdcByLedgerContext-filter',
				fn: function filterAccountingToMdcByLedgerContext(taxCode, accounting) {
					return taxCode.LedgerContextFk === accounting.LedgerContextFk;
				}
			},
			{
				key: 'billingSchemaByLedgerContext-filter',
				fn: function billingSchemaByLedgerContext(item, context) {
					return item.LedgerContextFk === context.LedgerContextFk;
				}
			},
			{
				key: 'rubricCategoryByActivityGroup-filter',
				fn: function filterCategoryByActivityGroup(item) {
					return filterCategoryByRubric(item, 81);
				}
			},
			{
				key: 'rubricCategoryByBidRubric-filter',
				fn: function filterCategoryByBidRubric(item) {
					return filterCategoryByRubric(item, 4); // Bid Rubric
				}
			},
			{
				key: 'rubricCategoryBySalesContractRubric-filter',
				fn: function filterCategoryBySalesContractRubric(item) {
					return filterCategoryByRubric(item, 5); // Sales Contract Rubric
				}
			},
			{
				key: 'rubricCategoryBySalesWipRubric-filter',
				fn: function filterCategoryBySalesWipRubric(item) {
					return filterCategoryByRubric(item, 17); // Sales WIP Rubric
				}
			},
			{
				key: 'rubricCategoryByBillRubric-filter',
				fn: function filterCategoryByBillRubric(item) {
					return filterCategoryByRubric(item, 7); // Bill Rubric
				}
			},
			{
				key: 'crbPriceConditionType-filter',
				fn: function filtercrbPriceConditionTypet(item) {
					return item.IsGeneralstype === true;
				}
			},
			{
				key: 'rubricCategoryByStockTransaction-filter',
				fn: function filterRubricCategoryByStockTransaction(item) {
					return item.RubricFk === 27 || item.RubricFk === 28 || item.RubricFk === 34;
				}
			},
			{
				key: 'rubricCategoryByRfi-filter',
				fn: function filterCategoryBySchedule(item) {
					return filterCategoryByRubric(item, 39);
				}
			},
			{
				key: 'costCodeByContext-filter',
				fn: function filterCostCodeByContext(costcodes, item) {
					return costcodes.ContextFk === item.ContextFk;
				}
			},
			{
				key: 'ledgerContext-filter',
				fn: function filterAccountByContext(account, item) {
					return account.LedgerContextFk === item.LedgerContextFk;
				}
			},
			{
				key: 'rubricCategoryByResourceRequisition-filter',
				fn: function filterCategoryByResourceRequisition(item) {
					return filterCategoryByRubric(item, 98);
				}
			},
			{
				key: 'accessRoleFunctional-filter',
				fn: function (item, it) {
					return item.IsFunctional === true;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		this.getStatusEntityName = function getStatusEntityName() {
			var selType = basicsCustomizeTypeDataService.getSelected();
			var entityName = '';
			if (selType) {
				entityName = basicsCustomizeStatusTransitionConfigurationService.StatusEntityByTable(selType.DBTableName);
			}

			return entityName;
		};

		this.provideCompanyLookup = function provideCompanyLookup(fieldProperty, selType) {
			var overload = {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-company-company-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'company',
						displayMember: 'Code'
					},
					width: 140
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-company-company-lookup',
						descriptionMember: 'CompanyName',
						lookupOptions: {}
					}
				}
			};

			if (fieldProperty.Name === selType.UseCompanyContext) {
				overload.readonly = true;
			}

			return overload;
		};

		this.enhanceAccountingLookup = function enhanceAccountingLookup(conf, selType, fieldProperty) {
			if (selType.DBTableName === 'BAS_ACCOUNT2MDC_CONTR_COST') {
				if (fieldProperty.Name === 'AccountFk') {
					conf.options.field = 'LedgerContextFk';
					conf.options.customIntegerProperty = 'MDC_LEDGER_CONTEXT_FK';
					conf.options.filterKey = 'accountingToMdcByLedgerContext-filter';
				}
			}
			return conf;
		};

		this.enhanceTaxCodeLookup = function enhanceTaxCodeLookup(conf, selType, fieldProperty) {
			if (selType.DBTableName === 'INV_REJECTIONREASONACC' || selType.DBTableName === 'LGM_SETTLEMENT_LC_TYPE') {
				if (fieldProperty.Name === 'TaxCodeFk') {
					conf.options.field = 'LedgerContextFk';
					conf.options.customIntegerProperty = 'MDC_LEDGER_CONTEXT_FK';
					conf.options.filterKey = 'invoceRejectionReasonByLedgerContext-filter';
				}
			}
			return conf;
		};

		this.enhanceLineItemContextLookup = function enhanceLineItemContextLookup(conf, selType, fieldProperty) {
			if (selType.DBTableName === 'BOQ_TYPE') {
				if (fieldProperty.Name === 'LineitemcontextFk') {
					conf.options.field = 'ContextFk';
					conf.options.customIntegerProperty = 'MDC_CONTEXT_FK';
				}
			}

			return conf;
		};

		this.enhanceCrbPriceConditionTypeLookup = function enhanceCrbPriceConditionTypeLookup(conf, selType, fieldProperty) {
			if (selType.DBTableName === 'PRC_GENERALSTYPE') {
				if (fieldProperty.Name === 'CrbPriceConditionTypeFk') {
					conf.options.field = 'CrbPriceConditionTypeFk';
					conf.options.customBoolProperty = 'IS_GENERALSTYPE';
					conf.options.filterKey = 'crbPriceConditionType-filter';
				}
			}
			return conf;
		};

		this.enhanceParameterLookup = function enhanceParameterLookup(conf, selType, fieldProperty) {
			if (selType.DBTableName === 'EST_PARAMETER_VALUE') {
				if (fieldProperty.Name === 'ParameterFk') {
					conf.att2BDisplayed = 'Code';
				}
			}
			return conf;
		};

		this.getUserLookup = function getUserLookup() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'usermanagement-user-user-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'usermanagement-user-user-dialog',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Name'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'User',
						displayMember: 'Name'
					}
				}
			};
		};

		this.getUserGroupLookup = function getUserGroupLookup() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'usermanagement-group-group-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'usermanagement-group-group-dialog',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Name'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'accessgroup',
						displayMember: 'Name'
					}
				}
			};
		};

		this.getMaterialGroupLookup = function getMaterialGroupLookup() {
			return {
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'basics-material-material-group-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-material-material-group-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialGroup',
						displayMember: 'Code'
					}
				}
			};
		};

		this.getCostCodeLookup = function getCostCodeLookup(lookupTypeString, lookupDirectiveString, Identifier) {
			var overload = {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						additionalColumns: true,
						lookupDirective: lookupDirectiveString,
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true,
							additionalColumns: true,
							displayMember: 'Code'
						},
						directive: lookupDirectiveString
					},
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: lookupTypeString,
						displayMember: 'Code'
					}
				}
			};
			if(Identifier === 'basics.customize.gcccostcodeassign'){
				_.assign(overload.grid.editorOptions.lookupOptions,{filterKey: 'costCodeByContext-filter'});
			}
			return overload;
		};

		this.enhanceRubricCategoryLookup = function enhanceRubricCategoryLookup(conf, selType, fieldProperty) {
			conf.options.field = 'RubricFk';
			conf.options.customIntegerProperty = 'BAS_RUBRIC_FK';
			switch (selType.DBTableName) {
				case 'BAS_DEFECT_TYPE':
					conf.options.filterKey = 'rubricCategoryByDefect-filter';
					break;
				case 'BAS_SCHEDULING_CONTEXT':
					conf.options.filterKey = 'rubricCategoryByActivityGroup-filter';
					break;
				case 'BAS_SITETYPE':
					conf.options.filterKey = 'rubricCategoryByBasSite-filter';
					break;
				case 'BIL_CATEGORY_DEFAULTS':
					conf.options.filterKey = 'rubricCategoryByCustomerBilling-filter';
					break;
				case 'BID_TYPE':
				case 'BID_STATUS':
					conf.options.filterKey = 'rubricCategoryByBidRubric-filter';
					break;
				case 'ORD_TYPE':
				case 'ORD_STATUS':
					conf.options.filterKey = 'rubricCategoryBySalesContractRubric-filter';
					break;
				case 'WIP_TYPE':
				case 'WIP_STATUS':
					conf.options.filterKey = 'rubricCategoryBySalesWipRubric-filter';
					break;
				case 'BIL_TYPE':
					conf.options.filterKey = 'rubricCategoryByBillRubric-filter';
					break;
				case 'BIL_STATUS':
					conf.options.filterKey = 'rubricCategoryByCustomerBilling-filter';
					break;
				case 'BPD_SUBLEDGER_CONTEXT':
					if (fieldProperty.Name === 'RubricCategoryCFk') {
						conf.options.filterKey = 'rubricCategoryBySubledgerC-filter';
					} else if (fieldProperty.Name === 'RubricCategorySFk') {
						conf.options.filterKey = 'rubricCategoryBySubledgerS-filter';
					}
					break;
				case 'COS_TYPE':
					conf.options.filterKey = 'rubricCategoryByConstructionSystemInstance-filter';
					break;
				case 'DFM_STATUS':
					conf.options.filterKey = 'rubricCategoryByDefect-filter';
					break;
				case 'ENG_DRAWING_TYPE':
					conf.options.filterKey = 'rubricCategoryByEngDrawingType-filter';
					break;
				case 'ENG_TASK_STATUS':
					conf.options.filterKey = 'rubricCategoryByEngTaskStatus-filter';
					break;
				case 'ENG_TYPE':
					conf.options.filterKey = 'rubricCategoryByEngType-filter';
					break;
				case 'INV_TYPE':
					conf.options.filterKey = 'rubricCategoryByInvoiceReconciliation-filter';
					break;
				case 'LGM_DISPATCH_STATUS':
					conf.options.filterKey = 'rubricCategoryByLogisticDispatch-filter';
					break;
				case 'LGM_JOBCARDSTATUS':
					conf.options.filterKey = 'rubricCategoryByLogisticJobCardStatus-filter';
					break;
				case 'LGM_JOBTYPE':
					conf.options.filterKey = 'rubricCategoryByLogisticJob-filter';
					break;
				case 'LGM_SETTLEMENTSTATUS':
					conf.options.filterKey = 'rubricCategoryByLogisticSettlement-filter';
					break;// Logistic Settlement
				case 'MTG_TYPE':
					conf.options.filterKey = 'rubricCategoryByMeeting-filter';
					break;
				case 'PPS_HEADER_TYPE':
					conf.options.filterKey = 'rubricCategoryByProductionPlanning-filter';
					break;
				case 'PPS_ITEM_STATUS':
					conf.options.filterKey = 'rubricCategoryByPpsItemStatus-filter';
					break;
				case 'PPS_ITEM_TYPE':
					conf.options.filterKey = 'rubricCategoryByPpsItemType-filter';
					break;
				case 'PPS_PHASE_TYPE':
					conf.options.filterKey = 'rubricCategoryByPpsPhaseType-filter';
					break;
				case 'PPS_PROCESS_TYPE':
					conf.options.filterKey = 'rubricCategoryByPpsProcessType-filter';
					break;
				case 'PPS_PROD_SET_STATUS':
					conf.options.filterKey = 'rubricCategoryByProductionPlanning-filter';
					break;
				case 'PPS_UPSTREAM_ITEM_STATUS':
					conf.options.filterKey = 'rubricCategoryByPpsUpstreamItemStatus-filter';
					break;
				case 'PRC_STCKTRANTYPE2RUB_CAT':
					conf.options.filterKey = 'rubricCategoryByStockTransaction-filter';
					break;
				case 'PRJ_CHANGEREASON':
					conf.options.filterKey = 'rubricCategoryByChange-filter';
					break;
				case 'PRJ_CHANGESTATUS':
					conf.options.filterKey = 'rubricCategoryByChange-filter';
					break;
				case 'PRJ_CHANGETYPE':
					conf.options.filterKey = 'rubricCategoryByChange-filter';
					break;
				case 'PRJ_DOCUMENTCATEGORY':
					conf.options.filterKey = 'rubricCategoryByProjectDocument-filter';
					break;
				case 'PRJ_DOCUMENTSTATUS':
					conf.options.filterKey = 'rubricCategoryByProjectDocument-filter';
					break;
				case 'PRJ_RFISTATUS':
					conf.options.filterKey = 'rubricCategoryByRfi-filter';
					break;
				case 'PRJ_STATUS':
					conf.options.filterKey = 'rubricCategoryByProject-filter';
					break;
				case 'PSD_ACTIVITYSTATE':
					conf.options.filterKey = 'rubricCategoryBySchedule-filter';
					break;// Scheduling
				case 'PSD_SCHEDULESTATUS':
					conf.options.filterKey = 'rubricCategoryBySchedule-filter';
					break;// Scheduling
				case 'PSD_SCHEDULETYPE':
					conf.options.filterKey = 'rubricCategoryBySchedule-filter';
					break;// Scheduling
				case 'QTO_TYPE':
					conf.options.filterKey = 'rubricCategoryByQuantityTakeOff-filter';
					break;// Scheduling
				case 'TRS_BUNDLE_STATUS':
					conf.options.filterKey = 'rubricCategoryByTrsBundleStatus-filter';
					break;
				case 'TRS_BUNDLE_TYPE':
					conf.options.filterKey = 'rubricCategoryByTrsBundleType-filter';
					break;
				case 'TRS_PKG_TYPE':
					conf.options.filterKey = 'rubricCategoryByTrsPgkType-filter';
					break;
				case 'BAS_RESOURCE_CONTEXT':
					conf.options.filterKey = 'rubricCategoryByResourceRequisition-filter';
					break;
			}
			return conf;
		};

		this.getRubricCategoryLookup = function getRubricCategoryLookup(fieldProperty, selType) {
			var conf = self.getGenericLookupConfig('basics.lookup.rubriccategory', fieldProperty);

			return self.enhanceRubricCategoryLookup(conf, selType, fieldProperty);
		};

		this.addCustomIntPropertyToConfig = function addCustomIntPropertyToConfig(config, fieldProperty, selType) {
			if(!!fieldProperty.Reference.FilterColumn && !!fieldProperty.Reference.FilteredColumn) {
				var filterName = selType.DBTableName + '__' + fieldProperty.Name;
				filterName = filterName.toLowerCase();

				if(_.isNil(selfData[filterName])) {
					var filter = {
						key: filterName,
						fn: function (candidate, entity) {
							return candidate[fieldProperty.Reference.FilteredColumn] === entity[fieldProperty.Reference.FilterColumn];
						}
					};

					selfData[filterName] = filter;
					basicsLookupdataLookupFilterService.registerFilter([filter]);
				}

				config.options.filterKey = filterName;
				config.options.customIntegerProperty = fieldProperty.Reference.FilteredColumn;
			}
		};

		this.getGenericLookupConfig = function getGenericLookupConfig(name, fieldProperty, selType) {
			var res = {lookupName: name, options: {required: fieldProperty.Required}};
			var tableName = fieldProperty.Reference.DBTable;

			self.addCustomIntPropertyToConfig(res, fieldProperty, selType);

			if (!_.isUndefined(tableName)) {
				if (_.endsWith(tableName, 'RULE')) {
					res.att2BDisplayed = 'COMMENT_TEXT';
				}
			}
			if (name === 'basics.customize.rubriccategory') {
				res = self.enhanceRubricCategoryLookup(res, selType, fieldProperty);
			}

			if (name === 'basics.customize.rubriccategory') {
				res = self.enhanceRubricCategoryLookup(res, selType, fieldProperty);
			}

			if(name === 'basics.company.internal.taxcode'){
				res = self.enhanceTaxCodeLookup(res, selType, fieldProperty);
			}

			if(name === 'basics.customize.accounting.internal'){
				res = self.enhanceAccountingLookup(res, selType, fieldProperty);
			}

			if(name === 'basics.customize.lineitemcontext.internal'){
				res = self.enhanceLineItemContextLookup(res, selType, fieldProperty);
			}

			if(name === 'basics.customize.crbpriceconditiontype'){
				res = self.enhanceCrbPriceConditionTypeLookup(res, selType, fieldProperty);
			}

			if(name === 'basics.customize.estparameter'){
				res = self.enhanceParameterLookup(res, selType, fieldProperty);
			}

			return res;
		};

		this.getDefinedLookup = function getDefinedLookup(genLookupQualifier, fieldProperty, selType){
			var overload = null;
			if (selType.DBTableName === 'PRC_STCKTRANTYPE2RUB_CAT' && genLookupQualifier === 'basics.customize.rubriccategory') {
				overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsMasterDataRubricCategoryRubricLookupDataService',
					filterKey: 'rubricCategoryByStockTransaction-filter'
				});
			}
			if (selType.DBTableName === 'BAS_ACCOUNT2MDC_CONTR_COST' && genLookupQualifier === 'basics.customize.accounting.internal') {
				overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomAccountLookupDataService',
					filterKey: 'ledgerContext-filter'
				});
			}
			return overload;
		};

		/* jshint -W074 */ // For me there is no cyclomatic complexity
		this.getLookupDropDownOverload = function getLookupDropDownOverload(selType, fieldProperty) {
			var refInfo = fieldProperty.Reference;
			var overload = null;
			var conf;

			var genLookupQualifier = basicsCustomizeLookupConfigurationService.getSimpleLookupQualifier(refInfo.DBTable);
			if (!_.isNull(genLookupQualifier) && !_.isUndefined(genLookupQualifier)) {
				var definedLookup = self.getDefinedLookup(genLookupQualifier,fieldProperty, selType);
				if(definedLookup !== undefined &&  definedLookup !== null){
					overload = definedLookup;
				}else{
					conf = self.getGenericLookupConfig(genLookupQualifier, fieldProperty, selType);
					overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
				}
			}
			else {
				switch (refInfo.DBTable) {
					case 'BAS_CLERK':
						overload = {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Description'
								}
							}
						};
						break;
					case 'BAS_CLERK_ROLE':
						conf = self.getGenericLookupConfig('basics.clerk.role', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'BAS_REPORT':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsConfigReportLookupService',
							enableCache: true
						});
						break;
					case 'BAS_COMPANY':
						overload = self.provideCompanyLookup(fieldProperty, selType);
						break;
					case 'BAS_COSTGROUP_CAT': overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicCostGroupCatalogLookupDataService',
						enableCache: true
					});
						break;
					case 'BAS_CURRENCY':
						conf = self.getGenericLookupConfig('basics.currency', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'BAS_FILEARCHIVEDOC':
						break;
					case 'BAS_FILEARCHIVEURL':
						break;
					case 'BAS_MODULE':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsCustomPlanningBoardModuleFilterDataService'},
							{required: fieldProperty.Required});
						break;
					case 'BAS_PAYMENT_TERM':
						conf = self.getGenericLookupConfig('basics.lookup.paymentterm', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'BAS_RUBRIC':
						conf = self.getGenericLookupConfig('basics.lookup.rubric', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'BAS_RUBRIC_CATEGORY':
						overload = self.getRubricCategoryLookup(fieldProperty, selType);
						break;
					case 'BAS_SCHEDULING_CONTEXT':
						conf = self.getGenericLookupConfig('basics.lookup.schedulingcontext', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'BAS_TEXT_MODULE':
						conf = self.getGenericLookupConfig('basics.company.textmodule', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'BAS_UOM':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'},
							{required: fieldProperty.Required});
						break;
					case 'BOQ_STRUCTURE':
						break;
					case 'BPD_SUBLEDGER_CONTEXT':
						conf = self.getGenericLookupConfig('basics.company.subledgercontext', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'CAL_CALENDAR':
						conf = self.getGenericLookupConfig('basics.company.calendar', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'MDC_MATERIAL_GROUP':
						overload = self.getMaterialGroupLookup();
						break;
					case 'ETM_WORKOPERATIONTYPE': overload =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceWorkOperationTypeLookupDataService'});
						break;
					case 'EST_HEADER':
						break;
					case 'ETM_CATALOG':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceCatalogLookupDataService'
						});
						break;
					case 'FRM_USER':
						overload = self.getUserLookup();
						break;
					case 'FRM_ACCESSGROUP':
						overload = self.getUserGroupLookup();
						break;
					case 'LGM_JOBCARDTEMPLATE':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'logisticCardTemplateLookupDataService'
						});
						break;
					case 'MDC_BILLING_SCHEMA':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsBillingSchemaByLedgerContextLookupDataService',
							filterKey: 'billingSchemaByLedgerContext-filter'
						});
						break;
					case 'MDC_CONTEXT':
						conf = self.getGenericLookupConfig('basics.lookup.context', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'MDC_CONTR_COST_CODE':
						overload =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsControllingCostCodesLookupDataService',
							filterKey: 'controllingCostCode-filter'
						});
						break;
					case 'MDC_LEDGER_CONTEXT':
						conf = self.getGenericLookupConfig('basics.company.ledgercontext', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'MDC_TAX_CODE':
						conf = self.getGenericLookupConfig('basics.company.internal.taxcode', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'PRC_AWARDMETHOD':
						conf = self.getGenericLookupConfig('basics.company.ledgercontext', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'PRC_CONFIGHEADER':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'procurementLookupConfigHeaderDataService',
							enableCache: true
						}, {required: fieldProperty.Required});
						break;
					case 'PRC_CONFIGURATION':
						overload = {
							id: 'configurationfk',
							field: 'ConfigurationFk',
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-configuration-configuration-combobox',
								lookupOptions: {'filterKey': 'prcConfigurationByRubric-filter'}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcConfiguration',
								displayMember: 'DescriptionInfo.Translated'
							}
						};
						break;
					case 'PRC_CONTRACTTYPE':
						conf = self.getGenericLookupConfig('prc.common.contracttype', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;

					case 'PRC_STRATEGY':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'procurementLookupConfigHeaderDataService',
							enableCache: true
						}, {required: fieldProperty.Required});
						break;
					case 'PRC_STRUCTURE':
						overload = {
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcStructure',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-procurementstructure-structure-dialog'
								},
								width: 100
							}
						};
						break;
					case 'PRC_SYSTEMEVENTTYPE':
						conf = self.getGenericLookupConfig('basics.customize.systemeventtype', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'PSD_ACTIVITYSTATE':
						conf = self.getGenericLookupConfig('scheduling.lookup.activitystate', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'PSD_EVENTTYPE':
						conf = self.getGenericLookupConfig('basics.customize.eventtype', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'REQ_STATUS':
						conf = self.getGenericLookupConfig('prc.req.status', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'RES_TYPE':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceTypeLookupDataService'},
							{required: fieldProperty.Required});
						break;
					case 'WFE_TEMPLATE':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCustomWorkflowTemplateLookupDataService',
							filter: function () {
								return self.getStatusEntityName();
							}
						}, {required: fieldProperty.Required});
						break;
					case 'BAS_COUNTRY':
						overload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCountryLookupDataService',
							enableCache: true
						});
						break;
					case 'PRC_STRUCTUREACCOUNT':
						overload = {
							detail: {
								type: 'directive',
								directive: 'basics-procurementstructure-account-lookup',
								options: {
									regex: '^[\\s\\S]{0,16}$',
									displayMember: 'Code',
									isTextEditable: true,
									showClearButton: true
								}
							},
							grid: {
								editor: 'directive',
								editorOptions: {
									regex: '^[\\s\\S]{0,16}$',
									directive: 'basics-procurementstructure-account-lookup',
									showClearButton: true,
									isTextEditable: true,
									displayMember: 'Code',
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.entity) {
												if (args.selectedItem) {
													args.entity.BasAccountFk = args.selectedItem.Id;
												}
											}
										}
									}]
								}
							}
						};
						break;
					case 'MDC_COST_CODE':
						if(selType.Identifier === 'basics.customize.gcccostcodeassign' && fieldProperty.Name === 'CostCodeCostFk'){
							overload = this.getCostCodeLookup('estimatecostcode', 'estimate-cost-codes-lookup', selType.Identifier);
						}else{
							overload = this.getCostCodeLookup('costcode', 'basics-cost-codes-lookup', selType.Identifier);
						}
						break;
					case 'PRC_PRICECONDITION':
						overload = {
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										dataService: 'basicsMaterialPriceConditionDataServiceNew'
									},
									directive: 'basics-Material-Price-Condition-Combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcPricecondition',
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						};
						break;
					case 'BAS_TEXT_AREA':
						conf = self.getGenericLookupConfig('basics.customize.textarea', fieldProperty, selType);
						overload = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(conf);
						break;
					case 'FRM_ACCESSROLE':
						overload = {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'usermanagement-right-role-dialog',
									filterKey: 'accessRoleFunctional-filter',																
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'usermanagement-right-role-dialog',									
									lookupOptions: {
										filterKey: 'accessRoleFunctional-filter',

										showClearButton: true,
										displayMember: 'Name'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'AccessRole',
									displayMember: 'Name'
								}
							}
						}
						break;
					default:
						break;
				}
			}

			return overload;
		};

		this.isReferenceDropDownColumn = function isReferenceDropDownColumn(fieldProperty) {
			return fieldProperty.Reference && fieldProperty.Reference.DBTable && fieldProperty.Reference.DBTable.length > 0;
		};

		this.getLookupDomainOverload = function getLookupDomainOverload(selType, fieldProperty) {
			var ovl = null;

			switch(fieldProperty.Name) {
				case 'ModuleName': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsStringConfigModuleLookupDataService'},
					{required: true});
					ovl.field = 'ModuleName';
					break;
				case 'TableName': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsStringConfigTableLookupDataService',
					filter: function(item) {
						return item.ModuleName;
					}},{required: true});
					ovl.field = 'TableName';
					break;
				case 'ColumnName':  ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsStringConfigColumnDataService',
					filter: function(item) {
						return item.TableName;
					}},{required: true});
					ovl.field = 'ColumnName';
					break;
			}

			return ovl;
		};
	}
})();
