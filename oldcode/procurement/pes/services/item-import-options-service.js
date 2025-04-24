   /**
	 * Created by alm on 11.14.2022
	 */
	(function () {
		/* global globals */
		'use strict';

		var moduleName = 'procurement.pes';

		angular.module(moduleName).factory('itemImportOptionsService', ['$q', '$http', '$translate','$injector','$timeout',
			function ($q, $http, $translate,$injector,$timeout) {
				var service = {};

				var importOptions = {
					ModuleName: moduleName,
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
					ImportDescriptor: {
						Fields: [
							{
								PropertyName: 'ContractCode',
								EntityName: 'PesItem',
								DomainName: 'description',
								DisplayName: 'procurement.pes.entityConHeaderFk',
							},
							{
								PropertyName: 'PrcItem_Code',
								EntityName: 'PesItem',
								DisplayName: 'procurement.pes.entityPrcItemFk',
								DomainName: 'description'
							},
							{
								PropertyName: 'MDC_MATERIAL_FK',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'customlookup',
								NotUseDefaultValue: true,
								DisplayMember: 'Code',
								DisplayName: 'procurement.common.prcItemMaterialNoForImport',
								LookupType:'materialrecord'
							},
							{
								PropertyName: 'Quantity',
								EntityName: 'PesItem',
								DomainName: 'quantity',
								Editor: 'domain',
								DisplayName: 'procurement.pes.entityQuantity',
							},
							{
								PropertyName: 'TaxCode',
								EntityName: 'Tax',
								DomainName: 'integer',
								Editor: 'simpledescriptionlookup',
								LookupQualifier: 'masterdata.context.taxcode',
								DisplayMember: 'Code',
								DisplayName: 'cloud.common.entityTaxCode'
							},
							{
								PropertyName: 'Uom',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'simpledescriptionlookup',
								LookupQualifier: 'basics.uom',
								DisplayMember: 'UOM'
							},
							{
								PropertyName: 'PriceOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.pes.entityPriceOc'
							},
							{
								PropertyName: 'ProjectCode',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'customlookup',
								LookupType:'project',
								DisplayMember: 'ProjectName',
								DisplayName: 'cloud.common.entityProjectNo'
							},
							{
								PropertyName: 'PackageCode',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'customlookup',
								LookupType:'PrcPackage',
								DisplayMember: 'Code',
								DisplayName: 'procurement.pes.entityPackageFk'
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
								PropertyName: 'PRC_STRUCTURE_FK',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'simpledescriptionlookup',
								NotUseDefaultValue: true,
								LookupQualifier: 'prc.structure.withcontext',
								DisplayMember: 'Code',
								DisplayName: 'cloud.common.entityStructureCode'
							},
							{
								PropertyName: 'Description1',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.prcItemDescription1'
							},
							{
								PropertyName: 'Description2',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.prcItemFurtherDescription'
							},
							{
								PropertyName: 'PrcStockTransaction',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'customlookup',
								LookupType:'PrcStocktransaction',
								DisplayMember: 'MaterialDescription',
								DisplayName: 'procurement.common.entityPrcStockTransaction'
							},
							{
								PropertyName: 'PrcStockTransactionType',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'simpledescriptionlookup',
								LookupQualifier: 'basics.customize.prcstocktransactiontype',
								DisplayName: 'procurement.common.entityPrcStockTransactionType',
								DisplayMember: 'Description'
							},
							{
								PropertyName: 'PrjStockLocation',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'customlookup',
								LookupType:'ProjectStockLocation',
								DisplayMember: 'Code',
								DisplayName: 'procurement.common.entityPrjStockLocation'
							},
							{
								PropertyName: 'PrjStock',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'customlookup',
								LookupType:'ProjectStock',
								DisplayMember: 'Code',
								DisplayName: 'procurement.common.entityPrjStock'
							},
							{
								PropertyName: 'LotNo',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.entityLotNo'
							},
							{
								PropertyName: 'BatchNo',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.pes.entityBatchNo'
							},
							{
								PropertyName: 'ProvisionPercent',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.entityProvisionPercent'
							},
							{
								PropertyName: 'ProvisonTotal',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.entityProvisonTotal'
							},
							{
								PropertyName: 'Userdefined1',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.userDefined1'
							},
							{
								PropertyName: 'Userdefined2',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.userDefined2'
							},
							{
								PropertyName: 'Userdefined3',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.userDefined3'
							},
							{
								PropertyName: 'Userdefined4',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.userDefined4'
							},
							{
								PropertyName: 'Userdefined5',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.userDefined5'
							},
							{
								PropertyName: 'IsFinalDelivery',
								EntityName: 'PesItem',
								DomainName: 'boolean',
								Editor: 'domain',
								DisplayName: 'procurement.pes.entityIsFinalDelivery'
							},
							/*{
								PropertyName: 'PriceExtraOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.prcItemPriceExtrasCurrency'
							},*/
							{
								PropertyName: 'PriceCondition',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'simpledescriptionlookup',
								NotUseDefaultValue: true,
								LookupQualifier: 'prc.pricecondition',
								DisplayMember: 'description',
								DisplayName: 'cloud.common.entityPriceCondition'
							},
							{
								PropertyName: 'IsAssetManagement',
								EntityName: 'PesItem',
								DomainName: 'boolean',
								Editor: 'domain',
								DisplayName: 'procurement.pes.entityIsAssetmanagement'
							},
							/*{
								PropertyName: 'ControllinggrpsetFk',
								EntityName: 'PesItem',
								DomainName: 'boolean',
								Editor: 'domain',
								DisplayName: 'cloud.common.entityControllinggrpset'
							},*/
							{
								PropertyName: 'DiscountSplitOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.DiscountSplitOcEntity'
							},
							{
								PropertyName: 'PriceGrossOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.priceOcGross'
							},
							/*{
								PropertyName: 'TotalOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.pes.entityPesValueOc'
							},
							{
								PropertyName: 'TotalGrossOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.totalOcGross'
							},
							{
								PropertyName: 'TotalPriceGrossOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.totalPriceGrossOc'
							},
							{
								PropertyName: 'TotalPriceOc',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.prcItemTotalPriceCurrency'
							},
							*/
							{
								PropertyName: 'ExternalCode',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.externalCode'
							},
							{
								PropertyName: 'MaterialExternalCode',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'domain',
								DisplayName: 'procurement.common.prcItemMaterialExternalCode'
							},
							{
								PropertyName: 'ExpirationDate',
								EntityName: 'PesItem',
								DomainName: 'date',
								IsDefaultNullForDomain: true,
								NotUseDefaultValue: true,
								Editor: 'domain',
								DisplayName: 'procurement.common.ExpirationDate'
							},
							{
								PropertyName: 'AlternativeUom',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'simpledescriptionlookup',
								LookupQualifier: 'basics.uom',
								DisplayMember: 'UOM',
								DisplayName: 'procurement.common.AlternativeUom'
							},{
								PropertyName: 'AlternativeQuantity',
								EntityName: 'PesItem',
								DomainName: 'quantity',
								Editor: 'domain',
								DisplayName: 'procurement.common.AlternativeQuantity',
							},
							{
								PropertyName: 'TotalOcDelivered',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.pes.entityDeliveredTotalOc'
							},
							{
								PropertyName: 'BudgetPerUnit',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.entityBudgetPerUnit'
							},
							{
								PropertyName: 'BudgetTotal',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.entityBudgetTotal'
							},
							{
								PropertyName: 'BudgetFixedTotal',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.entityBudgetFixedTotal'
							},
							{
								PropertyName: 'BudgetFixedUnit',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName: 'procurement.common.entityBudgetFixedUnit'
							},
							{
								PropertyName: 'BasBlobSpecification',
								EntityName: 'PesItem',
								DomainName: 'description',
								Editor: 'none',
								DisplayName: 'cloud.common.EntitySpec'
							},
							{
								PropertyName: 'MdcSalesTaxGroup',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'simpledescriptionlookup',
								LookupQualifier: 'basics.customize.salestaxgroup',
								DisplayName: 'procurement.pes.entityMdcSalesTaxGroup',
								DisplayMember: 'Code'
							},
							{
								PropertyName: 'StandardCost',
								EntityName: 'PesItem',
								DomainName: 'money',
								Editor: 'domain',
								DisplayName:'procurement.pes.entityStandardCost'
							},
							{
								PropertyName: 'MaterialStock',
								EntityName: 'PesItem',
								DomainName: 'integer',
								Editor: 'customlookup',
								NotUseDefaultValue: true,
								DisplayMember: 'Code',
								LookupType:'MaterialCommodity',
								DisplayName: 'procurement.pes.entityStockMaterial'
							},
							{
								PropertyName: 'QuantityAskedFor',
								EntityName: 'PesItem',
								DomainName: 'quantity',
								Editor: 'domain',
								DisplayName: 'procurement.common.prcItemQuantityAskedfor',
							}
						],
						FieldProcessor: function (parentScope, oldProfile) {
							$timeout(function () {
								var oldFields=angular.copy(parentScope.entity.ImportDescriptor.Fields);
								var contractItemHasValueOrNot=_.find(oldFields,function(item){return (item.PropertyName==='PrcItem_Code')&&(!_.isNil(item.MappingName));});
								var value=contractItemHasValueOrNot.MappingName!==''?true:false;
								loadMapFieldReadOnly(value);
							}, 10);
						}
					},
					mapFieldValidator: mapFieldValidator,
					HandleImportSucceed: function () {
						var procurementPesItemService = $injector.get('procurementPesItemService');
						procurementPesItemService.load();
					},
					OnImportSucceededCallback: function () {
					},
					OnImportFormatChangedCallback: function (newFormat, importOptions) {
					}
				};

				service.getImportOptions = function () {
					return importOptions;
				};

				function loadMapFieldReadOnly(value){
					var platformGridAPI=$injector.get('platformGridAPI');
					var platformRuntimeDataService=$injector.get('platformRuntimeDataService');
					var grid = platformGridAPI.grids.element('id', '4aea8b65ee5248129d2164e00868fea4');
					var gridDatas = grid.dataView.getRows();
					var item = _.find(gridDatas,function(item){return item.PropertyName==='MDC_MATERIAL_FK';});
					if (value) {
						platformRuntimeDataService.readonly(item, [{field: 'MappingName', readonly: true}]);
					} else {
						platformRuntimeDataService.readonly(item, [{field: 'MappingName', readonly: false}]);
					}
				}

				function mapFieldValidator(entity, value, model){
					if(entity.PropertyName==='PrcItem_Code'&&model==='MappingName') {
						var platformGridAPI=$injector.get('platformGridAPI');
						var platformRuntimeDataService=$injector.get('platformRuntimeDataService');
						var grid = platformGridAPI.grids.element('id', '4aea8b65ee5248129d2164e00868fea4');
						var gridDatas = grid.dataView.getRows();
						var item = _.find(gridDatas,function(item){return item.PropertyName==='MDC_MATERIAL_FK';});
						if (value) {
							platformRuntimeDataService.readonly(item, [{field: 'MappingName', readonly: true}]);
						} else {
							platformRuntimeDataService.readonly(item, [{field: 'MappingName', readonly: false}]);
						}
					}
					return {apply: true, valid: true, error: ''};
				}

				return service;
			}
		]);
	})(angular);
