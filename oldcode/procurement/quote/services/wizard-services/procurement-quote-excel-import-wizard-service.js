/**
 * Created by lsi on 8/30/2018.
 */

// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	angular.module(moduleName).factory('procurementQtnExcelImportWizardService', [
		'$translate','procurementQuoteHeaderDataService', 'procurementQuoteRequisitionDataService','procurementQuoteTotalDataService',
		'procurementCommonPriceConditionService','platformGridAPI','platformRuntimeDataService','procurementCommonPrcItemDataService',
		function ($translate, mainService, requisitionService, procurementQuoteTotalDataService,
			procurementCommonPriceConditionService, platformGridAPI, platformRuntimeDataService,itemService) {
			var service = {};
			var importOptions = {
				preprocessor : function() {
					var s = mainService.getSelected();
					if (s) {
						importOptions.CustomSettingsPage.skip = false;
						if(requisitionService.itemList.length === 1){
							_.forEach(requisitionService.itemList, function (item) {
								item.IsSelected =true;
							});
							importOptions.CustomSettingsPage.skip = true;
						}else{
							_.forEach(requisitionService.itemList, function (item) {
								var readonlystatus = requisitionService.getEditorMode() === 0;
								item.IsSelected = readonlystatus;
								platformRuntimeDataService.readonly(item, [{
									field: 'IsSelected',
									readonly: readonlystatus
								}]);
							});
						}
						importOptions.ImportDescriptor.CustomSettings.GridData = requisitionService.itemList;
						importOptions.ImportDescriptor.CustomSettings.Quote = s.Code;
						return true;
					}
					else {
						return { cancel: true, msg: $translate.instant('procurement.quote.importQuote.mustSelectQuote') };
					}
				},
				ModuleName: moduleName,
				DoubletFindMethodsPage: {
					skip: true
				},
				ImportDescriptor: {
					Description: [
						{
							value: 0,
							label: $translate.instant('procurement.quote.importQuote.importAll')
						},
						{
							value: 1,
							label: $translate.instant('procurement.quote.importQuote.importSelected')
						}
					],
					Fields: [
						{
							PropertyName: 'CODE',
							EntityName: 'QuoteRequisition',
							DomainName: 'description',
							Editor: 'domain',
							readonly: true,
							DisplayName:'procurement.quote.importQuote.reqCode'
						},
						{
							PropertyName: 'ITEMNO',
							EntityName: 'PrcItem',
							DomainName: 'description',
							Editor: 'domain',
							readonly: true,
							DisplayName:'procurement.quote.itemItemNo'
						},
						/*  defect 96058, remove replacementItem
                       {
                            PropertyName: 'PRC_REPLACEMENT_ITEM_FK',
                            EntityName: 'PrcItem',
                            DomainName: 'description',
                            Editor: 'domain',
                            readonly: true,
                            DisplayName:'procurement.quote.importQuote.replacementItemItemNo'
                        }, */
						{
							PropertyName: 'PRICE_OC',
							EntityName: 'PrcItem',
							DomainName: 'money',
							Editor: 'domain',
							NotUseDefaultValue:true,
							DisplayName:'procurement.common.prcItemPriceCurrency'
						},
						{
							PropertyName: 'PRICE_UNIT',
							EntityName: 'PrcItem',
							DomainName: 'money',
							Editor: 'domain',
							NotUseDefaultValue:true,
							DisplayName:'procurement.quote.itemPriceUnit'
						},
						{
							PropertyName: 'BAS_UOM_PRICE_UNIT_FK',
							ValueName: 'Uom_Id',
							EntityName: 'Uom',
							DomainName: 'lookup',
							Editor: 'idlookup',
							NotUseDefaultValue:true,
							DisplayName:'procurement.quote.itemPriceUnitUom',
							DisplayMember: 'Unit',
							EditorDirective:'basics-lookupdata-uom-lookup',
							FormatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						},
						{
							PropertyName: 'PRC_PRICECONDITION_FK',
							EntityName: 'PriceCondition',
							DomainName:'integer',
							Editor:'simplelookup',
							NotUseDefaultValue:true,
							LookupQualifier: 'prc.pricecondition',
							DisplayMember: 'description',
							DisplayName:'procurement.quote.itemPriceCondition'
						},
						{
							PropertyName: 'PRC_PRICECONDITIONTYPE_FK',
							EntityName: 'PrcItemPriceCondition',
							DomainName:'description',
							Editor: 'simplelookup',
							NotUseDefaultValue:true,
							LookupQualifier: 'prc.priceconditiontype',
							DisplayMember: 'code',
							DisplayName: 'procurement.quote.importQuote.priceConditionType'
						},
						{
							PropertyName: 'VALUE',
							EntityName: 'PrcItemPriceCondition',
							DomainName:'description',
							NotUseDefaultValue:true,
							Editor:'domain',
							DisplayName:'procurement.quote.importQuote.priceConditionValue'
						},
						{
							PropertyName: 'USERDEFINED1',
							EntityName: 'PrcItem',
							DomainName: 'description',
							Editor: 'domain',
							DisplayName:'procurement.quote.importQuote.userDefined1'
						},
						{
							PropertyName: 'USERDEFINED2',
							EntityName: 'PrcItem',
							DomainName: 'description',
							Editor: 'domain',
							DisplayName:'procurement.quote.importQuote.userDefined2'
						},
						{
							PropertyName: 'USERDEFINED3',
							EntityName: 'PrcItem',
							DomainName: 'description',
							Editor: 'domain',
							DisplayName:'procurement.quote.importQuote.userDefined3'
						},
						{
							PropertyName: 'USERDEFINED4',
							EntityName: 'PrcItem',
							DomainName: 'description',
							Editor: 'domain',
							DisplayName:'procurement.quote.importQuote.userDefined4'
						},
						{
							PropertyName: 'USERDEFINED5',
							EntityName: 'PrcItem',
							DomainName: 'description',
							Editor: 'domain',
							DisplayName:'procurement.quote.importQuote.userDefined5'
						},
						{
							PropertyName: 'FACTOR_PRICE_UNIT',
							EntityName: 'PrcItem',
							DomainName: 'money',
							NotUseDefaultValue:true,
							Editor: 'domain',
							DisplayName:'cloud.common.entityFactor'
						}/* ,defect 96058, removed replacementItem, and the fields rely on it.
                        {
                            PropertyName: 'MDC_MATERIAL_FK',
                            ValueName:'Material_Id',
                            EntityName: 'Material',
                            DomainName: 'lookup',
                            Editor: 'idlookup',
                            NotUseDefaultValue:true,
                            DisplayMember: 'Code',
                            DisplayName: 'procurement.quote.itemMaterialNo',
                            EditorDirective:'basics-material-common-material-lookup',
                            FormatterOptions: {
                                lookupType: 'materialrecord',
                                displayMember: 'Code'
                            }
                        },
                       {
                            PropertyName: 'DESCRIPTION1',
                            EntityName: 'PrcItem',
                            DomainName: 'description',
                            Editor: 'domain',
                            DisplayName:'procurement.quote.itemDescription1'
                        },
                        {
                            PropertyName: 'DESCRIPTION2',
                            EntityName: 'PrcItem',
                            DomainName: 'description',
                            Editor: 'domain',
                            DisplayName:'procurement.quote.itemDescription2'
                        },
                        {
                            PropertyName: 'SPECIFICATION',
                            EntityName: 'PrcItem',
                            DomainName: 'description',
                            Editor: 'domain',
                            DisplayName:'procurement.quote.itemSpecification'
                        },
                        {
                            PropertyName: 'QUANTITY',
                            EntityName: 'PrcItem',
                            DomainName: 'quantity',
                            NotUseDefaultValue:true,
                            Editor: 'domain',
                            DisplayName:'cloud.common.entityQuantity'
                        },
                        {
                            PropertyName: 'MDC_CONTROLLINGUNIT_FK',
                            ValueName:'Controllingunit_Id',
                            EntityName: 'Controllingunit',
                            DomainName:'lookup',
                            Editor: 'idlookup',
                            NotUseDefaultValue:true,
                            DisplayMember: 'Code',
                            DisplayName:'cloud.common.entityControllingUnitCode',
                            EditorDirective:'basics-master-data-context-controlling-unit-lookup',
                            FilterKey: 'quote-import-controllingunit-filter',
                            FormatterOptions: {
                                lookupType: 'controllingunit',
                                displayMember: 'Code'
                            }
                        },
                        {
                            PropertyName: 'PRC_STRUCTURE_FK',
                            ValueName:'PrcStructure_Id',
                            EntityName: 'PrcStructure',
                            DomainName:'lookup',
                            Editor: 'idlookup',
                            NotUseDefaultValue:true,
                            DisplayMember: 'Code',
                            DisplayName:'procurement.quote.importQuote.prcStructure',
                            EditorDirective:'basics-procurementstructure-structure-dialog',
                            FormatterOptions: {
                                lookupType: 'PrcStructure',
                                displayMember: 'Code'
                            }
                        },
                        {
                            PropertyName: 'MDC_TAX_CODE_FK',
                            EntityName: 'TaxCode',
                            DomainName:'integer',
                            Editor:'simplelookup',
                            NotUseDefaultValue:true,
                            LookupQualifier: 'masterdata.context.taxcode',
                            DisplayMember: 'Code',
                            DisplayName:'cloud.common.entityTaxCode'
                        },
                        {
                            PropertyName: 'BAS_PAYMENT_TERM_FI_FK',
                            EntityName: 'PaymentTerm',
                            DomainName:'integer',
                            Editor:'simplelookup',
                            NotUseDefaultValue:true,
                            LookupQualifier: 'basics.lookup.paymentterm',
                            DisplayMember: 'Code',
                            DisplayName:'cloud.common.entityPaymentTermFI'
                        },
                        {
                            PropertyName: 'BAS_PAYMENT_TERM_PA_FK',
                            EntityName: 'PaymentTerm',
                            DomainName:'integer',
                            Editor:'simplelookup',
                            NotUseDefaultValue:true,
                            LookupQualifier: 'basics.lookup.paymentterm',
                            DisplayMember: 'Code',
                            DisplayName:'cloud.common.entityPaymentTermPA'
                        },
                        {
                            PropertyName: 'PRC_INCOTERM_FK',
                            EntityName: 'PrcIncoterm',
                            DomainName:'integer',
                            Editor:'simplelookup',
                            NotUseDefaultValue:true,
                            LookupQualifier: 'prc.incoterm',
                            DisplayMember: 'Description',
                            DisplayName:'cloud.common.entityIncoterms'
                        },
                        {
                            PropertyName: 'SUPPLIERREFERENCE',
                            EntityName: 'PrcItem',
                            DomainName: 'description',
                            Editor: 'domain',
                            DisplayName:'procurement.common.prcItemSupplierReference'
                        } */
					],
					CustomSettings:{
						GridData:{},
						Quote:null
					}
				},
				CustomSettingsPage: {
					Config: {
						showGrouping: false,
						groups: [
							{
								gid: '1',
								header: '',
								header$tr$: '',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							{
								gid: '1',
								rid: 'ImportDescriptor',
								label: '',
								label$tr$: '',
								type: 'directive',
								model: 'GridData',
								directive: 'requisition-select-form',
								visible: true,
								sortOrder: 1
							}
						]
					},
					skip:false
				},
				/**
				 * @return {boolean}
				 */
				CanNext:function () {
					var tmpItem = _.find(requisitionService.itemList, {IsSelected:true});
					return !!tmpItem;
				},
				HandleImportEnded:function () {
					requisitionService.setEditorMode(true);
				},
				HandleImportSucceed:function () {
					requisitionService.setEditorMode(true);
					procurementQuoteTotalDataService.load()
						.then(function () {
							procurementQuoteTotalDataService.gridRefresh();
						});
					itemService.getService(requisitionService).load()
						.then(function () {
							itemService.getService(requisitionService).gridRefresh();
							procurementCommonPriceConditionService.getService(requisitionService).data.usesCache = false;
						});
					requisitionService.load()
						.then(function () {
							var reqItemList = requisitionService.getList();
							_.forEach(reqItemList,function (req) {
								delete itemService.getService(requisitionService).data.cache[req.Id];
							});
						});
				},
				mapFieldValidator: mapFieldValidator,
				validateMapFields:function(grid,fields){
					if (grid && grid.instance){
						var mandatory = ['CODE', 'ITEMNO', 'PRICE_OC'];
						var valid = true;
						for (var i=0; i<fields.length; i++){
							var propertyName = fields[i].PropertyName.toUpperCase();
							if(mandatory.indexOf(propertyName)>=0 && (!fields[i].MappingName)){
								var result = mapFieldValidator(fields[i], fields[i].MappingName , 'MappingName');
								platformRuntimeDataService.applyValidationResult(result, fields[i], 'MappingName');
								valid = false;
							}
						}
						if(!valid){
							platformGridAPI.grids.refresh(grid.id,valid);
						}
						return valid;
					}
					return true;
				}
			};
			function mapFieldValidator(entity, value, model) {
				var mandatory = ['CODE', 'ITEMNO', 'PRICE_OC'];
				var propertyName = entity.PropertyName.toUpperCase();
				if(model === 'MappingName' && mandatory.indexOf(propertyName)>=0 && !value){
					var message = $translate.instant('procurement.quote.importQuote.emptyErrorMessage', {'DisplayName': entity.DisplayName});
					return {apply: true, valid: false, error: message};
				}
				return {apply: true, valid: true, error: ''};
			}
			service.getImportOptions = function () {
				return importOptions;
			};
			return service;
		}]);
})(angular);