(function () {
	'use strict';
	/* global _ */
	var moduleName = 'procurement.common';
	/**
	 * @ngdoc service
	 * @name prcCommonItemImportOptionsService
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('prcCommonItemImportOptionsService',
		['$translate','procurementContextService', 'platformRuntimeDataService', 'platformGridAPI','procurementCommonPrcItemCostGroupColumnsService', 'prcGetIsCalculateOverGrossService',
			function ($translate, moduleContextService, platformRuntimeDataService, platformGridAPI,procurementCommonPrcItemCostGroupColumnsService, prcGetIsCalculateOverGrossService) {

				var service = {};
				var needToCheckItemNo = true;
				var fields = [
					{
						PropertyName: 'ITEMNO',
						EntityName: 'PrcItem',
						DomainName: 'integer',
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemItemNoForImport',
						ribFormatMappingName: 'Item Number',
						Only4RibFormat: false
					},
					{
						PropertyName: 'PRC_STRUCTURE_FK',
						EntityName: 'PrcStructure',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'prc.structure.withcontext',
						DisplayMember: 'Code',
						DisplayName: 'cloud.common.entityStructureCode'
					},
					{
						PropertyName: 'MATERIAL_CATALOG_CODE',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemMaterialCatalogCode'
					},
					{
						PropertyName: 'MDC_MATERIAL_FK',
						EntityName: 'Material',
						DomainName: 'integer',
						Editor: 'customlookup',
						NotUseDefaultValue: true,
						DisplayMember: 'Code',
						DisplayName: 'procurement.common.prcItemMaterialNoForImport',
						LookupType:'materialrecord'
					},
					{
						PropertyName: 'DESCRIPTION1',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemDescription1',
						ribFormatMappingName: 'Description 1'
					},
					{
						PropertyName: 'DESCRIPTION2',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemFurtherDescription'
					},
					{
						PropertyName: 'SPECIFICATION',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'cloud.common.EntitySpec'
					},
					{
						PropertyName: 'QUANTITY',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'cloud.common.entityQuantity',
						ribFormatMappingName: 'Quantity'
					},
					{
						PropertyName: 'BAS_UOM_FK',
						EntityName: 'BasUom',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'basics.uom',
						DisplayMember: 'UOM',
						AlternativeMember:'description',
						DisplayName: 'cloud.common.entityUoM',
						ribFormatMappingName: 'UoM'
					},
					{
						PropertyName: 'PRICE_OC',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.prcItemPriceCurrency',
						ribFormatMappingName: 'Price',
						NotShowInMappingGrid : false
					},
					{
						PropertyName: 'CHARGE_OC',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.entityChargeOc',
						ribFormatMappingName: 'Charge',
						NotShowInMappingGrid : false
					},
					{
						PropertyName: 'PRICE_OC_GROSS',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.priceOcGross',
						NotShowInMappingGrid : true
					},
					{
						PropertyName: 'PRC_PRICECONDITION_FK',
						EntityName: 'PriceCondition',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'prc.pricecondition',
						DisplayMember: 'description',
						DisplayName: 'cloud.common.entityPriceCondition'
					},
					{
						PropertyName: 'PRICE_UNIT',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'cloud.common.entityPriceUnit'
					},
					{
						PropertyName: 'BAS_UOM_PRICE_UNIT_FK',
						EntityName: 'Uom',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'basics.uom',
						DisplayMember: 'UOM',
						AlternativeMember:'description',
						DisplayName: 'cloud.common.entityPriceUnitUoM'
					},
					{
						PropertyName: 'FACTOR_PRICE_UNIT',
						EntityName: 'PrcItem',
						DomainName: 'money',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'cloud.common.entityFactor'
					},
					{
						PropertyName: 'MDC_CONTROLLINGUNIT_FK',
						EntityName: 'Controllingunit',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						LookupQualifier: 'masterdata.context.controllingunit.withcontext',
						DisplayName: 'cloud.common.entityControllingUnitCode',
						DisplayMember: 'Code',
						AlternativeMember:'description'
					},
					{
						PropertyName: 'TARGET_PRICE',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.prcItemTargetPrice'
					},
					{
						PropertyName: 'TARGET_PRICE_GROSS',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.prcItemTargetPriceGross',
						NotShowInMappingGrid: true
					},
					{
						PropertyName: 'DATE_REQUIRED',
						EntityName: 'PrcItem',
						DomainName: 'date',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.DateRequired'
					},
					{
						PropertyName: 'ONHIRE',
						EntityName: 'PrcItem',
						DomainName: 'date',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.OnHire'
					},
					{
						PropertyName: 'OFFHIRE',
						EntityName: 'PrcItem',
						DomainName: 'date',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.OffHire'
					},
					{
						PropertyName: 'MDC_TAX_CODE_FK',
						EntityName: 'TaxCode',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'masterdata.context.taxcode',
						DisplayMember: 'Code',
						AlternativeMember:'description',
						DisplayName: 'cloud.common.entityTaxCode'

					},
					{
						PropertyName: 'BAS_PAYMENT_TERM_FI_FK',
						EntityName: 'PaymentTerm',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'basics.lookup.paymentterm',
						DisplayMember: 'Code',
						AlternativeMember:'description',
						DisplayName: 'cloud.common.entityPaymentTermFI'

					},
					{
						PropertyName: 'BAS_PAYMENT_TERM_PA_FK',
						EntityName: 'PaymentTerm',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'basics.lookup.paymentterm',
						DisplayMember: 'Code',
						AlternativeMember:'description',
						DisplayName: 'cloud.common.entityPaymentTermPA'
					},
					{
						PropertyName: 'PRC_INCOTERM_FK',
						EntityName: 'PrcIncoterm',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier: 'prc.incoterm',
						DisplayMember: 'Description',
						DisplayName: 'cloud.common.entityIncoterms'
					},
					{
						PropertyName: 'SUPPLIERREFERENCE',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemSupplierReference'
					},
					{
						PropertyName: 'QUANTITY_ASKEDFOR',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemQuantityAskedfor'
					},
					{
						PropertyName: 'QUANTITY_DELIVERED',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemQuantityDelivered'
					},
					{
						PropertyName: 'QUANTITY_CONFIRM',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.delivery.quantityConfirm'
					},
					{
						PropertyName: 'DELIVERDATE_CONFIRM',
						EntityName: 'PrcItem',
						DomainName: 'date',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.delivery.deliverdateConfirm'
					},
					{
						PropertyName: 'SAFETY_LEADTIME',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.safetyLeadTime'
					},
					{
						PropertyName: 'BUFFER_LEADTIME',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.bufferLeadTime'
					},
					{
						PropertyName: 'LEADTIME_EXTRA',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.leadTimeExtra'
					},
					{
						PropertyName: 'USERDEFINED1',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.userDefined1'
					},
					{
						PropertyName: 'USERDEFINED2',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.userDefined2'
					},
					{
						PropertyName: 'USERDEFINED3',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.userDefined3'
					},
					{
						PropertyName: 'USERDEFINED4',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.userDefined4'
					},
					{
						PropertyName: 'USERDEFINED5',
						EntityName: 'PrcItem',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.userDefined5'
					},
					{
						PropertyName: 'IsFreeQuantity',
						EntityName: 'PrcItem',
						DomainName: 'Boolean',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.isFreeQuantity'
					},{
						PropertyName: 'LEADTIME',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.entityLeadTime'
					},{
						PropertyName: 'MIN_QUANTITY',
						EntityName: 'PrcItem',
						DomainName: 'quantity',
						NotUseDefaultValue: true,
						Editor: 'domain',
						DisplayName: 'procurement.common.prcItemMinQuantity'
					},
					{
						PropertyName: 'ITEM_TYPE',
						EntityName: 'ItemType',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier:'basics.itemtype',
						DisplayMember: 'description',
						AlternativeMember:'code',
						DisplayName: 'procurement.common.prcItemType'
					},
					{
						PropertyName: 'ITEM_TYPE2',
						EntityName: 'ItemType2',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier:'basics.itemtype2',
						DisplayMember: 'description',
						AlternativeMember:'code',
						DisplayName: 'procurement.common.prcItemType2'
					},
					{
						PropertyName: 'ITEM_TYPE85',
						EntityName: 'ItemType85',
						DomainName: 'integer',
						Editor: 'simpledescriptionlookup',
						NotUseDefaultValue: true,
						LookupQualifier:'basics.itemtype85',
						DisplayMember: 'description',
						AlternativeMember:'code',
						DisplayName: 'procurement.common.prcItemType85'
					},{
						PropertyName: 'COMMENT_CLIENT',
						EntityName: 'CommentClient',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.commentClient'
					},{
						PropertyName: 'COMMENT_CONTRACTOR',
						EntityName: 'CommentContractor',
						DomainName: 'description',
						Editor: 'domain',
						DisplayName: 'procurement.common.commentContractor',
						NotShowInMappingGrid : false
					},{
						PropertyName: 'CO2_PROJECT',
						EntityName: 'Co2Project',
						DomainName: 'quantity',
						Editor: 'domain',
						DisplayName: 'procurement.common.entityCo2Project'
					},{
						PropertyName: 'CO2_PROJECT_TOTAL',
						EntityName: 'Co2ProjectTotal',
						DomainName: 'quantity',
						Editor: 'domain',
						DisplayName: 'procurement.common.entityCo2ProjectTotal'
					},{
						PropertyName: 'CO2_SOURCE',
						EntityName: 'Co2Source',
						DomainName: 'quantity',
						Editor: 'domain',
						DisplayName: 'procurement.common.entityCo2Source'
					},{
						PropertyName: 'CO2_SOURCE_TOTAL',
						EntityName: 'Co2SourceTotal',
						DomainName: 'quantity',
						Editor: 'domain',
						DisplayName: 'procurement.common.entityCo2SourceTotal'
					},
					{
						PropertyName: 'DISCOUNT_ABSOLUTE_OC',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.DiscountAbsoluteOc'
					},
					{
						PropertyName: 'DISCOUNT_ABSOLUTE_GROSS_OC',
						EntityName: 'PrcItem',
						DomainName: 'money',
						Editor: 'domain',
						NotUseDefaultValue: true,
						DisplayName: 'procurement.common.DiscountAbsoluteGrossOc'
					}
				];
				var importOptions = {
					ModuleName: '',
					DoubletFindMethodsPage: {
						skip: true
					},
					FieldMappingsPage: {
						skip: false
					},
					EditImportPage: {
						skip: false
					},
					PreviewResultPage: {
						skip: false
					},
					OnStepChange:function(currentStep,entity){
						if(currentStep.number === 3){
							if(entity.ImportDescriptor.CustomSettings.IsImportPriceAfterTax){
								_.map(entity.ImportDescriptor.Fields,function(item){
									if(item.PropertyName === 'PRICE_OC'){
										item.NotShowInMappingGrid = true;
									}
									if(item.PropertyName === 'PRICE_OC_GROSS'){
										item.NotShowInMappingGrid = false;
									}
									if(item.PropertyName === 'TARGET_PRICE'){
										item.NotShowInMappingGrid = true;
									}
									if(item.PropertyName === 'TARGET_PRICE_GROSS'){
										item.NotShowInMappingGrid = false;
									}
									if(item.PropertyName === 'DISCOUNT_ABSOLUTE_OC'){
										item.NotShowInMappingGrid = true;
									}
									if(item.PropertyName === 'DISCOUNT_ABSOLUTE_GROSS_OC'){
										item.NotShowInMappingGrid = false;
									}
								});
							}else{
								_.map(entity.ImportDescriptor.Fields,function(item){
									if(item.PropertyName === 'PRICE_OC'){
										item.NotShowInMappingGrid = false;
									}
									if(item.PropertyName === 'PRICE_OC_GROSS'){
										item.NotShowInMappingGrid = true;
									}
									if(item.PropertyName === 'TARGET_PRICE'){
										item.NotShowInMappingGrid = false;
									}
									if(item.PropertyName === 'TARGET_PRICE_GROSS'){
										item.NotShowInMappingGrid = true;
									}
									if(item.PropertyName === 'DISCOUNT_ABSOLUTE_OC'){
										item.NotShowInMappingGrid = false;
									}
									if(item.PropertyName === 'DISCOUNT_ABSOLUTE_GROSS_OC'){
										item.NotShowInMappingGrid = true;
									}
								});
							}
						}
					},
					CustomSettingsPage: {
						skip:false,
						Config: {
							showGrouping: false,
							groups: [
								{
									gid: 'priceAfterTaxImport',
									header: '',
									header$tr$: '',
									isOpen: true,
									visible: true,
									sortOrder: 1
								}
							],
							rows: [
								{
									gid: 'priceAfterTaxImport',
									rid: 'IsImportPriceAfterTax',
									label: $translate.instant('basics.import.entityIsImportPriceAfterTax'),
									label$tr$: 'basics.import.entityIsImportPriceAfterTax',
									type: 'boolean',
									model: 'IsImportPriceAfterTax',
									validator: priceAfterTaxValidator,
									visible: true,
									sortOrder: 1
								}
							]
						}
					},
					ImportDescriptor: {
						CustomSettings: {},
						Fields: fields
					},
					GetSelectedMainEntityCallback: function () {
						var selectItem = moduleContextService.getLeadingService().getSelected();
						if (selectItem) {
							return selectItem.Id;
						}
						else {
							return null;
						}
					},
					CanNext: function () {
						return true;
					},
					HandleImportEnded: function () {
						// console.log('HandleImportEnded');
					},
					HandleImportSucceed: function () {
						// console.log('HandleImportSucceed');
						var leadingService = moduleContextService.getLeadingService();
						leadingService.refresh();
					},
					mapFieldValidator: mapFieldValidator,
					validateMapFields: validateMapFields,
					OnImportSucceededCallback: function () {
					},
					OnImportFormatChangedCallback: function (newFormat, importOptions) {

						if (newFormat === 6) {  // XLSX_RibMat
							setRibExcelMappingNames(importOptions.ImportDescriptor.Fields);
						}
					},

					ShowProtocollAfterImport: false,

					ExcelProfileContexts: ['MatBidder']
				};
				var mappingName = {
					itemNoMappingName: -1,
					uomMappingName: -1,
					reqCodeMappingName: -1
				};

				function setRibExcelMappingNames(fields)
				{
					angular.forEach(fields, function(field) {
						if (Object.prototype.hasOwnProperty.call(field,'ribFormatMappingName'))
						{
							field.MappingName = field.ribFormatMappingName;
						}
						else
						{
							field.MappingName = '';
						}
					});
				}


				function priceAfterTaxValidator(entity, value, model){
					entity[model] = value;
				}

				function mapFieldValidator(/* entity, value, model */) {
					return {apply: true, valid: true, error: ''};
				}

				function validateSucess(grid, checkFields) {
					angular.forEach(checkFields,function (field) {
						if(field.MappingName) {
							var validateResult = {apply: true, valid: true, error: ''};
							platformRuntimeDataService.applyValidationResult(validateResult, field, 'MappingName');
						}
					});
					platformGridAPI.grids.refresh(grid.id, true);
				}

				function allValidateFailed(grid, group1Config,group2Config) {
					if(group1Config.IsCheck){
						validateFields(grid,group1Config.CheckFields);
					}

					if(group2Config && group2Config.IsCheck){
						validateFields(grid,group2Config.CheckFields);
					}
				}

				function validateFields(grid,checkFields){
					angular.forEach(checkFields,function (field) {
						if(!field.MappingName) {
							var propertyName = field.PropertyName.toUpperCase();
							if (propertyName !== 'ITEMNO' || needToCheckItemNo) {
								var message = $translate.instant('procurement.common.emptyErrorMessage', {'DisplayName': field.DisplayName});
								var validateResult = {apply: true, valid: false, error: message};
								platformRuntimeDataService.applyValidationResult(validateResult, field, 'MappingName');
							}
						}
					});
					platformGridAPI.grids.refresh(grid.id, true);
				}

				function validateMapFields(grid, fields) {
					if (grid && grid.instance) {
						var checkFields = [];
						var checkFieldsReqCodeGroup = [];
						var itemNoField;
						var uomField;
						var hasReqCodeField = false;
						var reqCodeField;
						for (var i = 0; i < fields.length; i++) {
							var propertyName = fields[i].PropertyName.toUpperCase();
							if(propertyName === 'ITEMNO' && mappingName.itemNoMappingName !== fields[i].MappingName) {
								itemNoField = fields[i];
								mappingName.itemNoMappingName = fields[i].MappingName;
								checkFields.push(fields[i]);
							}
							if(propertyName === 'BAS_UOM_FK' && mappingName.uomMappingName !== fields[i].MappingName) {
								uomField = fields[i];
								mappingName.uomMappingName = fields[i].MappingName;
								checkFields.push(fields[i]);
							}
							if(propertyName === 'REQ_CODE' && mappingName.reqCodeMappingName !== fields[i].MappingName) {
								hasReqCodeField = true;
								reqCodeField = fields[i];
								mappingName.reqCodeMappingName = fields[i].MappingName;
								checkFieldsReqCodeGroup.push(fields[i]);
							}
						}
						var valid = true;
						var hasReqCodeFieldAndNotMapping = hasReqCodeField && !reqCodeField.MappingName && !reqCodeField.DefaultValue;
						var notHaveMappingItemNoField = itemNoField && !itemNoField.MappingName;
						var notHaveMappingUomNoField = uomField && !uomField.MappingName;
						var reqCodeFieldsGroupConfig = {
							IsCheck : hasReqCodeFieldAndNotMapping,
							CheckFields : checkFieldsReqCodeGroup
						};
						var itemAndUomNoGroupConfig = {
							IsCheck :   notHaveMappingItemNoField || notHaveMappingUomNoField,
							CheckFields : checkFields
						};

						if(reqCodeFieldsGroupConfig.IsCheck || itemAndUomNoGroupConfig.IsCheck) {
							valid = false;
							allValidateFailed(grid, itemAndUomNoGroupConfig,reqCodeFieldsGroupConfig);
						}
						if (checkFields && checkFields.length && (!notHaveMappingItemNoField || !notHaveMappingUomNoField)) {
							validateSucess(grid, checkFields);
						}
						return valid;
					}
					return true;
				}

				var reqCodeConfiguration = {
					PropertyName: 'REQ_CODE',
					EntityName: 'QuoteRequisition',
					DomainName: 'description',
					Editor: 'domain',
					readonly: true,
					DisplayName:'procurement.quote.importQuote.reqCode'
				};

				var itemEvaluationFieldConfiguration = {
					PropertyName: 'PRC_ITEMEVALUATION_FK',
					EntityName: 'PrcItemEvaluation',
					DomainName: 'integer',
					Editor: 'simpledescriptionlookup',
					NotUseDefaultValue: true,
					DisplayMember: 'description',
					DisplayName: 'procurement.common.prcItemEvaluation',
					LookupQualifier: 'prc.item.evaluation'
				};

				function getQuoteModuleImportGroup(){
					return {
						gid: '1',
						header: '',
						header$tr$: '',
						isOpen: true,
						visible: true,
						sortOrder: 1
					};
				}

				function getQuoteModuleImportRow(){
					return {
						gid: '1',
						rid: 'ImportDescriptor',
						label: '',
						label$tr$: '',
						type: 'directive',
						model: 'GridData',
						directive: 'requisition-select-form',
						visible: true,
						sortOrder: 1
					};
				}

				function getQuoteModuleImportCommonOption(config){
					var quoteModuleOption = angular.copy(importOptions);

					if(config && config.isShowReqSelection){
						quoteModuleOption.CustomSettingsPage.Config.groups.unshift(getQuoteModuleImportGroup());
						quoteModuleOption.CustomSettingsPage.Config.rows.unshift(getQuoteModuleImportRow());
					}

					quoteModuleOption.ImportDescriptor.CustomSettings = {
						GridData:{},
						Quote:null
					};
					quoteModuleOption.ImportDescriptor.Fields.unshift(reqCodeConfiguration);
					quoteModuleOption.ImportDescriptor.Fields.push(itemEvaluationFieldConfiguration);

					quoteModuleOption.CanNext = function () {
						return true;
					};
					return quoteModuleOption;
				}

				function getQuoteModuleImportOption(config){
					var quoteModuleOption = getQuoteModuleImportCommonOption(config);
					var fieldsToBeRemoved = ['IsFreeQuantity','COMMENT_CONTRACTOR'];
					_.remove(quoteModuleOption.ImportDescriptor.Fields,function(field){
						return _.includes(fieldsToBeRemoved,field.PropertyName);
					});
					return attachDynamicCostGroupColumns(quoteModuleOption);
				}

				function getQuoteStatusIsProtectedImportOptions(config){
					return getQuoteModuleImportOption(config);
				}

				var quoteModule = 'procurement.quote';

				function removeUnecessaryCostGroupColumns(costGroupColumns){
					_.remove(costGroupColumns,function(column){
						var endString = '_Desc';
						return _.endsWith(column.id,endString);
					});
				}

				function attachDynamicCostGroupColumns(importOptions){
					var costGroupColumns = procurementCommonPrcItemCostGroupColumnsService.getPrcItemCostGroupColumns();
					removeUnecessaryCostGroupColumns(costGroupColumns);
					var dynamicCostGroupFileds = _.map(costGroupColumns,function(costGroupField){
						return {
							PropertyName: costGroupField.field,
							EntityName: costGroupField.name,
							DomainName: 'integer',
							DisplayName: costGroupField.name,
							Editor: 'customlookup',
							DisplayMember: 'Code',
							AlternativeMember:'Description',
							FormatterOptions:costGroupField.formatterOptions
						};
					});
					var fieldsWithDynamicCostGroups = importOptions.ImportDescriptor.Fields.concat(dynamicCostGroupFileds);
					var copiedImportOptions = angular.copy(importOptions);
					copiedImportOptions.ImportDescriptor.Fields = fieldsWithDynamicCostGroups;
					return copiedImportOptions;
				}

				function getItemList() {
					var list = moduleContextService.getItemDataService().getList();
					if (list && list.length) {
						return list;
					}
					else {
						return [];
					}
				}

				service.getImportOptions = function (moduleName,config) {
					mappingName = {
						itemNoMappingName: -1,
						uomMappingName: -1,
						reqCodeMappingName: -1
					};
					var existedItems = getItemList();
					needToCheckItemNo = !(!existedItems || !existedItems.length);
					importOptions.ModuleName = moduleName;
					var result;
					if(importOptions.ModuleName === quoteModule){
						if(config && config.IsProtected){
							result = getQuoteStatusIsProtectedImportOptions(config);
						}
						result = getQuoteModuleImportOption(config);
					}
					else {
						result = attachDynamicCostGroupColumns(importOptions);
					}
					result.isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					return result;
				};
				return service;
			}
		]);
})(angular);
