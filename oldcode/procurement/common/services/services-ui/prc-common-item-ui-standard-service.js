(function () {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var modName = 'procurement.common';
	var cloudCommonModule = 'cloud.common';
	var cellHighlightColor = '#ffa';

	angular.module(modName).factory('procurementCommonItemLayout',
		['platformLayoutHelperService', 'procurementCommonPrcItemDataService', 'procurementContextService', 'basicsCommonComplexFormatter', 'procurementCommonPriceConditionService', 'basicsLookupdataConfigGenerator', 'accounting', '$injector', 'basicsCommonRoundingService',
			'procurementItemProjectChangeService',
			function (platformLayoutHelperService, dataServiceFactory, moduleContext, basicsCommonComplexFormatter, priceConditionDataService, basicsLookupdataConfigGenerator, accounting, $injector, roundingService,procurementItemProjectChangeService) {
				var addColumns = [{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					width: 300,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				}];
				function highlightColumn(row, cell, value, columnDef, dataContext,plainText) {
					if (value === null) {
						value = dataContext[columnDef.field];
					}
					columnDef.domain='money';
					var highlightBg = '';
					var formatterVal = $injector.get('platformGridDomainService').formatter('money')(row, cell, value, columnDef,dataContext,plainText);
					if (!plainText) {
						if (columnDef.field === 'Price' && dataContext.IsChangePrice) {
							highlightBg = 'background: ' + cellHighlightColor + ';';
						}
						if (columnDef.field === 'PriceOc' && dataContext.IsChangePriceOc) {
							highlightBg = 'background: ' + cellHighlightColor + ';';
						}
						if (columnDef.field === 'PriceGross' && dataContext.IsChangePriceGross) {
							highlightBg = 'background: ' + cellHighlightColor + ';';
						}
						if (columnDef.field === 'PriceGrossOc' && dataContext.IsChangePriceGrossOc) {
							highlightBg = 'background: ' + cellHighlightColor + ';';
						}
						return '<div class="slick-highlight-cell" style="' + highlightBg + 'width: 100%; height: 100%; top: 0;left: 0; text-align: right;box-sizing: border-box; /*padding-right: 4px; padding-top: 2px;*/">' + formatterVal + '</div>';
					}
					return  formatterVal;
				}
				let basRoundingDataService = roundingService.getService('basics.material');
				let layout= {
					'fid': 'procurement.common.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['itemno', 'prcitemstatusfk', 'prcpackagefk', 'prcstructurefk', 'mdcmaterialfk', 'materialstockfk', 'description1',
								'description2', 'specification', 'quantity', 'basuomfk', 'factorpriceunit', 'quantityconfirm', 'deliverdateconfirm',
								'sellunit', 'leadtime', 'minquantity', 'safetyleadtime', 'totalleadtime', 'bufferleadtime', 'leadtimeextra',
								'quantityconverted',
								'basitemtypefk',
								'basitemtype2fk',
								'prcitemaltfk',
								'basitemtype85fk',
								'agn',
								'aan',
								'isfreequantity', 'discount', 'discountcomment', 'discountabsolute', 'discountabsoluteoc', 'discountabsolutegross', 'discountabsolutegrossoc', 'hasscope', 'externalcode',
								'prjstockfk', 'prjstocklocationfk', 'commentcontractor', 'commentclient',
								'quantityremaining', 'controllinggrpsetfk', 'plantfk', 'discountsplit', 'discountsplitoc',
								'materialexternalcode', 'alternativeuomfk', 'alternativequantity', 'resrequisitionfk', 'mdcsalestaxgroupfk', 'jobfk','isdisabled','iscontracted',
								'notsubmitted','co2project','co2projecttotal','co2sourcetotal','co2source'
							]
						},
						{
							'gid': 'pricing',
							'attributes': [
								'price',
								'priceunit', 'basuompriceunitfk', 'priceoc',
								'prcpriceconditionfk', 'priceextra', 'priceextraoc', 'totalprice', 'totalpriceoc',
								'targetprice', 'targettotal', 'total', 'totaloc', 'totalnodiscount', 'totalcurrencynodiscount', 'pricegross', 'pricegrossoc', 'totalgross', 'totalgrossoc', 'totalpricegross', 'totalpricegrossoc',
								'budgetperunit', 'budgettotal', 'budgetfixedunit', 'budgetfixedtotal', 'charge', 'chargeoc'
							]
						},
						{
							'gid': 'projectChange',
							'attributes': ['prjchangefk', 'prjchangestatusfk']
						},
						{
							'gid': 'plantHire',
							'attributes': [
								'daterequired', 'hasdeliveryschedule', 'onhire', 'offhire'
							]
						},
						{
							'gid': 'settings',
							'attributes': [
								'mdctaxcodefk',
								'baspaymenttermfifk', 'baspaymenttermpafk', 'prcincotermfk', 'address', 'hastext', 'supplierreference',
								'batchno', 'mdccontrollingunitfk', 'bpdagreementfk'
							]
						},
						{
							'gid': 'others',
							'attributes': [
								'quantityaskedfor', 'quantitydelivered'
							]
						},
						{
							'gid': 'user',
							'attributes': [
								'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5'
							]
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							pricing: {location: modName, identifier: 'pricing', initial: 'pricing'},
							plantHire: {location: modName, identifier: 'plantHire', initial: 'plantHire'},
							settings: {location: modName, identifier: 'settings', initial: 'settings'},
							others: {location: modName, identifier: 'others', initial: 'others'},
							user: {location: modName, identifier: 'user', initial: 'user'},
							Itemno: {location: modName, identifier: 'prcItemItemNo', initial: 'prcItemItemNo'},
							PrcItemstatusFk: {
								location: cloudCommonModule,
								identifier: 'entityState',
								initial: 'entityState'
							},
							PrcPackageFk: {location: modName, identifier: 'prcItemPackage', initial: 'prcItemPackage'},
							PrcStructureFk: {
								location: cloudCommonModule,
								identifier: 'entityStructureCode',
								initial: 'entityStructureCode'
							},
							MdcSalesTaxGroupFk: {
								location: cloudCommonModule,
								identifier: 'prcItemSalesTaxGroup',
								initial: 'Sales Tax Group'
							},
							MdcMaterialFk: {
								location: modName,
								identifier: 'prcItemMaterialNo',
								initial: 'prcItemMaterialNo'
							},
							MaterialStockFk: {
								location: modName,
								identifier: 'prcItemMaterialStockFk',
								initial: 'Stock Material'
							},
							BpdContactFk1: {
								location: modName,
								identifier: 'contactFirstName',
								initial: 'contactFirstName'
							},
							Description1: {
								location: modName,
								identifier: 'prcItemDescription1',
								initial: 'prcItemDescription1'
							},

							Description2: {
								location: modName,
								identifier: 'prcItemFurtherDescription',
								initial: 'Further Description'
							},
							Specification: {
								location: cloudCommonModule,
								identifier: 'EntitySpec',
								initial: 'EntitySpec'
							},
							Quantity: {
								location: cloudCommonModule,
								identifier: 'entityQuantity',
								initial: 'entityQuantity'
							},
							NewQuantity: {
								location: cloudCommonModule,
								identifier: 'entityNewQuantity',
								initial: 'entityNewQuantity'
							},
							BasItemTypeFk: {
								location: modName,
								identifier: 'prcItemType',
								initial: 'prcItemType'
							},
							BasItemType2Fk: {
								location: modName,
								identifier: 'prcItemType2',
								initial: 'prcItemType2'
							},
							BasItemType85Fk: {
								location: modName,
								identifier: 'alternativeBid',
								initial: 'Alternative Bid'
							},
							PrcItemAltFk: {
								location: modName,
								identifier: 'prcItemAlt',
								initial: 'prcItemAlt'
							},
							AGN:{
								location: modName,
								identifier: 'AGN',
								initial: 'AGN'
							},
							AAN:{
								location: modName,
								identifier: 'AAN',
								initial: 'AAN'
							},
							IsFreeQuantity: {
								location: modName,
								identifier: 'isFreeQuantity',
								initial: 'isFreeQuantity'
							},
							Discount: {
								location: modName,
								identifier: 'Discount',
								initial: 'Discount'
							},
							DiscountComment: {
								location: modName,
								identifier: 'DiscountComment',
								initial: 'DiscountComment'
							},
							DiscountAbsolute: {
								location: modName,
								identifier: 'DiscountAbsolute',
								initial: 'Discount Absolute'
							},
							DiscountAbsoluteOc: {location: modName, identifier: 'DiscountAbsoluteOc', initial: 'Discount Absolute (OC)'},
							DiscountAbsoluteGross: {location: modName, identifier: 'DiscountAbsoluteGross', initial: 'Discount Absolute Gross'},
							DiscountAbsoluteGrossOc: {location: modName, identifier: 'DiscountAbsoluteGrossOc', initial: 'Discount Absolute Gross (OC)'},
							LicCostGroup1Fk: {location: modName, identifier: 'licCostGroup1Fk', initial: 'LicCostGroup1'},
							LicCostGroup2Fk: {location: modName, identifier: 'licCostGroup2Fk', initial: 'LicCostGroup2'},
							LicCostGroup3Fk: {location: modName, identifier: 'licCostGroup3Fk', initial: 'LicCostGroup3'},
							LicCostGroup4Fk: {location: modName, identifier: 'licCostGroup4Fk', initial: 'LicCostGroup4'},
							LicCostGroup5Fk: {location: modName, identifier: 'licCostGroup5Fk', initial: 'LicCostGroup5'},
							PrjCostGroup1Fk: {location: modName, identifier: 'prjCostGroup1Fk', initial: 'PrjCostGroup1'},
							PrjCostGroup2Fk: {location: modName, identifier: 'prjCostGroup2Fk', initial: 'PrjCostGroup2'},
							PrjCostGroup3Fk: {location: modName, identifier: 'prjCostGroup3Fk', initial: 'PrjCostGroup3'},
							PrjCostGroup4Fk: {location: modName, identifier: 'prjCostGroup4Fk', initial: 'PrjCostGroup4'},
							PrjCostGroup5Fk: {location: modName, identifier: 'prjCostGroup5Fk', initial: 'PrjCostGroup5'},
							BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'entityUoM'},
							Price: {location: cloudCommonModule, identifier: 'entityPrice', initial: 'entityPrice'},
							PriceOc: {
								location: modName,
								identifier: 'prcItemPriceCurrency',
								initial: 'prcItemPriceCurrency'
							},

							PrcPriceConditionFk: {
								location: cloudCommonModule,
								identifier: 'entityPriceCondition',
								initial: 'entityPriceCondition'
							},
							PriceExtra: {
								location: modName,
								identifier: 'prcItemPriceExtras',
								initial: 'prcItemPriceExtras'
							},
							PriceExtraOc: {
								location: modName,
								identifier: 'prcItemPriceExtrasCurrency',
								initial: 'prcItemPriceExtrasCurrency'
							},
							TotalPrice: {
								location: modName,
								identifier: 'prcItemTotalPrice',
								initial: 'prcItemTotalPrice'
							},
							TotalPriceOc: {
								location: modName,
								identifier: 'prcItemTotalPriceCurrency',
								initial: 'prcItemTotalPriceCurrency'
							},
							PriceUnit: {
								location: cloudCommonModule,
								identifier: 'entityPriceUnit',
								initial: 'entityPriceUnit'
							},

							BasUomPriceUnitFk: {
								location: cloudCommonModule,
								identifier: 'entityPriceUnitUoM',
								initial: 'entityPriceUnitUoM'
							},
							FactorPriceUnit: {
								location: cloudCommonModule,
								identifier: 'entityFactor',
								initial: 'entityFactor'
							},
							QuantityConfirm: {
								location: modName,
								identifier: 'quantityConfirm',
								initial: 'quantityConfirm'
							},
							DeliverDateConfirm: {
								location: modName,
								identifier: 'deliverDateConfirm',
								initial: 'deliverDateConfirm'
							},
							PlantFk: {
								location: modName,
								identifier: 'plantFk',
								initial: 'Plant'
							},
							TargetPrice: {
								location: modName,
								identifier: 'prcItemTargetPrice',
								initial: 'prcItemTargetPrice'
							},
							TargetTotal: {
								location: modName,
								identifier: 'prcItemTargetTotal',
								initial: 'prcItemTargetTotal'
							},
							Total: {location: cloudCommonModule, identifier: 'entityTotal', initial: 'entityTotal'},

							TotalOc: {
								location: modName,
								identifier: 'prcItemTotalCurrency',
								initial: 'prcItemTotalCurrency'
							},
							TotalNoDiscount: {location: modName, identifier: 'prcItemTotalNoDiscount', initial: 'prcItemTotalNoDiscount'},

							TotalCurrencyNoDiscount: {
								location: modName,
								identifier: 'prcItemTotalCurrencyNoDiscount',
								initial: 'prcItemTotalCurrencyNoDiscount'
							},
							DateRequired: {
								location: cloudCommonModule,
								identifier: 'entityRequiredBy',
								initial: 'entityRequiredBy'
							},
							NewDateRequired: {
								location: cloudCommonModule,
								identifier: 'entityNewDateRequired',
								initial: 'entityNewDateRequired'
							},
							Hasdeliveryschedule: {
								location: modName,
								identifier: 'prcItemHasDeliverySchedule',
								initial: 'prcItemHasDeliverySchedule'
							},
							Onhire: {location: modName, identifier: 'prcItemOnHireDate', initial: 'prcItemOnHireDate'},
							Offhire: {
								location: modName,
								identifier: 'prcItemOffHireDate',
								initial: 'prcItemOffHireDate'
							},
							MdcTaxCodeFk: {
								location: cloudCommonModule,
								identifier: 'entityTaxCode',
								initial: 'entityTaxCode'
							},
							PrcIncotermFk: {
								location: cloudCommonModule,
								identifier: 'entityIncotermCode',
								initial: 'entityIncotermCode'
							},
							BasPaymentTermFiFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermFI',
								initial: 'entityPaymentTermFI'
							},
							BasPaymentTermPaFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermPA',
								initial: 'entityPaymentTermPA'
							},
							Address: {
								location: modName,
								identifier: 'prcItemDeliveryAddress',
								initial: 'prcItemDeliveryAddress'
							},
							NewAddress: {
								location: cloudCommonModule,
								identifier: 'entityNewDeliveryAddress',
								initial: 'entityNewDeliveryAddress'
							},
							Hastext: {location: modName, identifier: 'prcItemHasText', initial: 'prcItemHasText'},
							Supplierreference: {
								location: modName,
								identifier: 'prcItemSupplierReference',
								initial: 'prcItemSupplierReference'
							},

							Batchno: {location: modName, identifier: 'prcItemBatchno', initial: 'prcItemBatchno'},
							BpdAgreementFk: {location: modName, identifier: 'bpdAgreement', initial: 'Agreement'},
							QuantityAskedfor: {
								location: modName,
								identifier: 'prcItemQuantityAskedfor',
								initial: 'prcItemQuantityAskedfor'
							},
							QuantityDelivered: {
								location: modName,
								identifier: 'prcItemQuantityDelivered',
								initial: 'prcItemQuantityDelivered'
							},
							Userdefined1: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'entityUserDefined',
								param: {'p_0': '1'}
							},
							Userdefined2: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'entityUserDefined',
								param: {'p_0': '2'}
							},
							Userdefined3: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'entityUserDefined',
								param: {'p_0': '3'}
							},
							Userdefined4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'entityUserDefined',
								param: {'p_0': '4'}
							},
							Userdefined5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'entityUserDefined',
								param: {'p_0': '5'}
							},
							SellUnit: {
								location: modName,
								identifier: 'prcItemSellUnit',
								initial: 'Sell Unit'
							},
							LeadTime: {
								location: modName,
								identifier: 'prcItemLeadTime',
								initial: 'Supplier Lead Time'
							},
							MinQuantity: {
								location: modName,
								identifier: 'prcItemMinQuantity',
								initial: 'Min Quantity'
							},
							SafetyLeadTime: {
								location: modName,
								identifier: 'safetyLeadTime',
								initial: 'Safety Lead Time'
							},
							BufferLeadTime: {
								location: modName,
								identifier: 'bufferLeadTime',
								initial: 'Buffer Lead Time'
							},
							TotalLeadTime: {
								location: modName,
								identifier: 'totalLeadTime',
								initial: 'Total Lead Time'
							},
							LeadTimeExtra: {
								location: modName,
								identifier: 'leadTimeExtra',
								initial: 'Express Lead Time'
							},
							QuantityConverted: {
								location: modName,
								identifier: 'prcItemFactoredQuantity',
								initial: 'Factored Quantity'
							},
							HasScope: {location: modName, identifier: 'entityHasScope', initial: 'Has Scope'},
							ExternalCode: {
								location: modName,
								identifier: 'externalCode',
								initial: 'External Code'
							},
							MaterialExternalCode: {
								location: modName,
								identifier: 'prcItemMaterialExternalCode',
								initial: 'Material External Code'
							},
							PrjStockFk: {
								location: modName,
								identifier: 'entityPrjStock',
								initial: 'Stock'
							},
							PrjStockLocationFk: {
								location: modName,
								identifier: 'entityPrjStockLocation',
								initial: 'Stock Location'
							},
							CommentContractor: {
								location: modName,
								identifier: 'CommentContractor',
								initial: 'Comment Contractor'
							},
							CommentClient: {
								location: modName,
								identifier: 'CommentClient',
								initial: 'Comment Client'
							},
							QuantityRemaining: {
								location: modName,
								identifier: 'prcItemRemainingQuantity',
								initial: 'Remaining Quantity'
							},
							DiscountSplit: {
								location: modName,
								identifier: 'DiscountSplitEntity',
								initial: 'Discount Split'
							},
							DiscountSplitOc: {
								location: modName,
								identifier: 'DiscountSplitOcEntity',
								initial: 'Discount Split Oc'
							},
							ControllinggrpsetFk: {location: cloudCommonModule, identifier: 'entityControllinggrpset', initial: 'Controlling grp set'},
							PriceGross: {
								location: modName,
								identifier: 'priceGross',
								initial: 'Price Gross'
							},
							PriceGrossOc: {
								location: modName,
								identifier: 'priceOcGross',
								initial: 'Price Gross (Oc)'
							},
							TotalGross: {
								location: modName,
								identifier: 'totalGross',
								initial: 'Total (Gross)'
							},
							TotalGrossOc: {
								location: modName,
								identifier: 'totalOcGross',
								initial: 'Total Gross (Oc)'
							},
							TotalPriceGross: {
								location: modName,
								identifier: 'totalPriceGross',
								initial: 'Total Price Gross'
							},
							TotalPriceGrossOc: {
								location: modName,
								identifier: 'totalPriceGrossOc',
								initial: 'Total Price Gross (OC)'
							},
							AlternativeUomFk: {
								location: modName,
								identifier: 'AlternativeUom',
								initial: 'Alternative Uom'
							},
							AlternativeQuantity: {
								location: modName,
								identifier: 'AlternativeQuantity',
								initial: 'Alternative Quantity'
							},
							ResRequisitionFk: {
								location: modName,
								identifier: 'entityResRequisition',
								initial: 'Resource Requisition'
							},
							BudgetPerUnit: {
								location: modName,
								identifier: 'entityBudgetPerUnit',
								initial: 'Budget Per Unit'
							},
							BudgetTotal: {
								location: modName,
								identifier: 'entityBudgetTotal',
								initial: 'Budget Total'
							},
							BudgetFixedUnit: {
								location: modName,
								identifier: 'entityBudgetFixedUnit',
								initial: 'Budget Fixed Unit'
							},
							BudgetFixedTotal: {
								location: modName,
								identifier: 'entityBudgetFixedTotal',
								initial: 'Budget Fixed Total'
							},
							JobFk: {
								location: modName,
								identifier: 'entityJob',
								initial: 'Job'
							},
							IsDisabled: {
								location: modName,
								identifier: 'entityIsDisabled',
								initial: 'Is Disabled'
							},
							IsContracted: {
								location: modName,
								identifier: 'entityIsContractedInOtherPkg',
								initial: 'Contracted in other Pkg'
							},
							ExQtnIsEvaluated: {
								location: modName,
								identifier: 'exQtnIsEvaluated',
								initial: 'Evaluated'
							},
							NotSubmitted: {
								location: modName,
								identifier: 'notSubmitted',
								initial: 'Not Submitted'
							},
							Co2Project:{
								location: modName,
								identifier: 'entityCo2Project',
								initial: 'CO2/kg (Project)'
							},
							Co2ProjectTotal:{
								location: modName,
								identifier: 'entityCo2ProjectTotal',
								initial: 'CO2/kg (Project Total)'
							},
							Co2SourceTotal:{
								location: modName,
								identifier: 'entityCo2SourceTotal',
								initial: 'CO2/kg (Source Total)'
							},
							Co2Source:{
								location: modName,
								identifier: 'entityCo2Source',
								initial: 'CO2/kg (Source)'
							},
							projectChange: {location: modName, identifier: 'projectChange', initial: 'Project Change'},
							PrjChangeFk: {location: modName, identifier: 'projectChange', initial: 'Project Change'},
							PrjChangeStatusFk: {location: modName, identifier: 'projectChangeStatus', initial: 'Project Change Status'},
							Charge: {location: modName, identifier: 'entityCharge', initial: 'Charge'},
							ChargeOc: {location: modName, identifier: 'entityChargeOc', initial: 'Charge Oc'},
						}
					},
					'overloads': {
						'itemno': {
							'mandatory': true,
							'detail': {
								'type': 'directive',
								'model': 'Itemno',
								'directive': 'basics-common-limit-input',
								'options': {
									validKeys: {
										regular: '^[1-9]{1}[0-9]{0,7}$'
									},
									isCodeProperty: true
								}
							},
							'grid': {
								formatter: 'integer',
								editor: 'directive',
								editorOptions: {
									directive: 'basics-common-limit-input',
									validKeys: {
										regular: '^[1-9]{1}[0-9]{0,7}$'
									},
									isCodeProperty: true
								}
							}
						},
						'prcitemstatusfk': {
							'detail': {
								'type': 'directive',
								'model': 'PrcItemstatusFk',
								'directive': 'procurement-common-prc-item-status-combobox',
								'options': {
									readOnly: true
								}
							},
							'grid': {
								editor: null,
								type: '',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcItemStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								},
								width: 100
							}
						},
						'prcpackagefk': {
							navigator: {
								moduleName: 'procurement.package',
								registerService: 'procurementPackageDataService'
							},
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'procurement-common-package-lookup',
									descriptionMember: 'Description'
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcPackage',
									displayMember: 'Code'
								},
								width: 100
							}
						},
						'prcstructurefk': {
							navigator: {
								moduleName: 'basics.procurementstructure'
								// registerService : 'basicsProcurementStructureService'
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-procurementstructure-structure-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcStructure',
									displayMember: 'Code',
									childProp: 'ChildItems'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										isFastDataRecording: true
									},
									directive: 'basics-procurementstructure-structure-dialog'
								},
								width: 100
							}
						},
						'mdcsalestaxgroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
							desMember: 'DescriptionInfo.Translated',
							enableCache: true,
							showClearButton: true,
							filterKey: 'procurement-common-item-mdcsalestaxgroup-filter'
						}),
						'mdcmaterialfk': {
							navigator: {
								moduleName: 'basics.material'
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-material-material-lookup',
								'options': {
									filterKey: 'procurement-common-item-mdcmaterial-filter',
									showClearButton: true,
									gridOptions: {
										multiSelect: true
									},
									usageContext: 'procurementCommonPrcItemDataService'
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialCommodity',
									displayMember: 'Code',
									dataServiceName: 'basicsMaterialFastRecordDataService',
									prepareFastSearchPayload: function (payload) {
										let mainService = moduleContext.getMainService();
										let itemService = moduleContext.getItemDataService();
										let header = mainService.getSelected();
										let item = itemService.getSelected();

										payload.CatalogId = header?.MaterialCatalogFk;
										payload.PrcStructureId = item?.PrcHeaderEntity?.StructureFk || item?.PrcStructureFk
									}
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'procurement-common-item-mdcmaterial-filter',
										showClearButton: true,
										gridOptions: {
											multiSelect: true
										},
										usageContext: 'procurementCommonPrcItemDataService',
										isFastDataRecording: true
									},
									directive: 'basics-material-material-lookup',
								},
								width: 100
							}
						},
						'materialstockfk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-material-material-lookup',
								'options': {
									'showClearButton': true,
									'gridOptions': {
										'multiSelect': true
									}
								},
							},
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'MaterialCommodity',
									'displayMember': 'Code'
								},
								'editor': 'lookup',
								'editorOptions': {
									'lookupOptions': {
										'gridOptions': {
											'multiSelect': true
										}
									},
									'directive': 'basics-material-material-lookup'
								},
								'width': 100
							}
						},
						'description1': {
							'mandatory': true
						},
						'description2': {
							'mandatory': true
						},
						'specification': {
							'mandatory': true
						},
						'quantity': {
							'mandatory': true
						},
						'quantityconverted': {
							readonly: true
						},
						/* 'quantity': {
							'detail': {
								'type': 'directive',
								'directive': 'procurement-item-quantity-input'
							},
							'grid': {
								//formatter: 'quantity',
								formatter: 'quantity',
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-item-quantity-input'
								},
								width: 100
							}
						}, */
						'basitemtypefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'procurement-common-item-type-combobox',
									'descriptionMember': 'DescriptionInfo.Translated'
									// 'lookupOptions': {
									// filterKey: 'procurement-common-item-type-filter'
									// }
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-common-item-type-combobox'
									// lookupOptions: { filterKey: 'procurement-common-item-type-filter' }
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcItemType',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 85
							}
						},
						// basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.itemtype'),
						'basitemtype2fk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'procurement-common-item-type2-combobox',
									'descriptionMember': 'DescriptionInfo.Translated'

								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-common-item-type2-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcItemType2',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 85
							}
						},
						'prcitemaltfk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'prc-common-item-dialog',
									'lookupOptions': {
										'showClearButton': true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'prcItemDialog',
									'displayMember': 'Itemno'
								},
								'width': 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'prc-common-item-dialog',
									'descriptionField': 'DescriptionInfo1.Translated',
									'descriptionMember': 'DescriptionInfo1.Translated',
									'lookupOptions': {
										'showClearButton': true
									}
								}
							}
						},
						'basitemtype85fk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'procurement-common-item-type85-combobox',
									'descriptionMember': 'DescriptionInfo.Translated'

								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-common-item-type85-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcItemType85',
									displayMember: 'CodeInfo.Translated'
								},
								width: 85
							}
						},
						'liccostgroup1fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup1'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group1-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group1-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup1',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup1LookupService'
								}
							}
						},
						'liccostgroup2fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup2'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group2-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group2-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup2',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup2LookupService'
								}
							}
						},
						'liccostgroup3fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup3'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group3-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group3-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup3',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup3LookupService'
								}
							}
						},
						'liccostgroup4fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup4'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group4-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group4-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup4',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup4LookupService'
								}
							}
						},
						'liccostgroup5fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup5'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group5-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group5-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup5',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup5LookupService'
								}
							}
						},
						'prjcostgroup1fk': {
							navigator: {
								moduleName: 'project.main-costgroup1'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group1-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group1-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup1',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup1LookupService'
								}
							}
						},

						'prjcostgroup2fk': {
							navigator: {
								moduleName: 'project.main-costgroup2'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group2-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group2-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup2',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup2LookupService'
								}
							}
						},

						'prjcostgroup3fk': {
							navigator: {
								moduleName: 'project.main-costgroup3'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group3-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group3-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup3',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup3LookupService'
								}
							}
						},

						'prjcostgroup4fk': {
							navigator: {
								moduleName: 'project.main-costgroup4'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group4-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group4-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup4',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup4LookupService'
								}
							}
						},

						'prjcostgroup5fk': {
							navigator: {
								moduleName: 'project.main-costgroup5'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group5-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group5-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup5',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup5LookupService'
								}
							}
						},
						'basuomfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup'
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-uom-lookup',
									lookupOptions: {
										isFastDataRecording: true
									}
								},
								width: 100
							}
						},
						'alternativeuomfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup'
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-uom-lookup',
									lookupOptions: {
										isFastDataRecording: true
									}
								},
								width: 100
							}
						},
						'jobfk': platformLayoutHelperService.provideJobLookupOverload(),
						'plantfk': platformLayoutHelperService.providePlantLookupOverload(),
						'price': {
							'mandatory': true,
							'detail': {
								'model': 'Price',
								'type': 'directive',
								'directive': 'procument-pes-item-highlight-cell-input',
								'options': {
									'judgeIsHighlightField': 'IsChangePrice',
									'hightlightColor': cellHighlightColor
								}
							},
							'grid': {
								'formatter': highlightColumn
							}
						},
						'priceoc': {
							'mandatory': true,
							'detail': {
								'model': 'PriceOc',
								'type': 'directive',
								'directive': 'procument-pes-item-highlight-cell-input',
								'options': {
									'judgeIsHighlightField': 'IsChangePrice',
									'hightlightColor': cellHighlightColor
								}
							},
							'grid': {
								'formatter': highlightColumn
							}
						},
						'pricegross': {
							'detail': {
								'model': 'PriceGross',
								'type': 'directive',
								'directive': 'procument-pes-item-highlight-cell-input',
								'options': {
									'judgeIsHighlightField': 'IsChangePriceGross',
									'hightlightColor': cellHighlightColor
								}
							},
							'grid': {
								'formatter': highlightColumn
							}
						},
						'pricegrossoc': {
							'detail': {
								'model': 'PriceGrossOc',
								'type': 'directive',
								'directive': 'procument-pes-item-highlight-cell-input',
								'options': {
									'judgeIsHighlightField': 'IsChangePriceGross',
									'hightlightColor': cellHighlightColor
								}
							},
							'grid': {
								'formatter': highlightColumn
							}
						},
						'prcpriceconditionfk': {
							'detail': {
								'type': 'directive',
								'directive': 'item-basics-Material-Price-Condition-Combobox',
								'options': {
									filterKey: 'req-requisition-filter',
									showClearButton: true,
									dataService: priceConditionDataService.getService
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcPricecondition',
									displayMember: 'DescriptionInfo.Translated'
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'item-basics-Material-Price-Condition-Combobox',
									lookupOptions: {
										filterKey: 'req-requisition-filter',
										showClearButton: true,
										dataService: priceConditionDataService.getService
									}
								},
								width: 180
							}
						},
						'priceextra': {
							'readonly': true,
							'mandatory': true
						},
						'priceextraoc': {
							'readonly': true,
							'mandatory': true
						},
						'totalprice': {
							'readonly': true,
							'mandatory': true
						},
						'totalpriceoc': {
							'readonly': true,
							'mandatory': true
						},
						'priceunit': {
							'mandatory': true
						},
						'basuompriceunitfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup',
								'options': {
									showClearButton: true
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										isFastDataRecording: true
									},
									directive: 'basics-lookupdata-uom-lookup'
								},
								width: 100
							}
						},
						'factorpriceunit': {
							'mandatory': true
						},
						'mdccontrollingunitfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'controlling-structure-dialog-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'procurement-common-item-controlling-unit-filter',
										considerPlanningElement: true,
										selectableCallback: function (dataItem) {
											return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataServiceFactory);
										}
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'controllingunit',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										filterKey: 'procurement-common-item-controlling-unit-filter',
										considerPlanningElement: true,
										selectableCallback: function (dataItem) {
											return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataServiceFactory);
										}
									},
									directive: 'controlling-structure-dialog-lookup'
								},
								width: 120
							}
						},
						'targetprice': {
							'mandatory': true
						},
						'targettotal': {
							'mandatory': true
						},
						'isfreequantity': {
							'mandatory': true
						},
						'total': {
							'readonly': true,
							'mandatory': true
						},
						'totaloc': {
							'readonly': true,
							'mandatory': true
						},
						'totalnodiscount': {
							'readonly': true,
							'mandatory': true
						},
						'totalcurrencynodiscount': {
							'readonly': true,
							'mandatory': true
						},
						'daterequired': {
							'mandatory': true
						},
						'hasdeliveryschedule': {
							'readonly': true,
							'mandatory': true
						},
						'onhire': {
							'mandatory': true
						},
						'offhire': {
							'mandatory': true
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
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'TaxCode',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupField: 'MdcTaxCodeFk',
									lookupOptions: {
										showClearButton: true
									},
									directive: 'basics-master-data-context-tax-code-lookup'
								},
								width: 100
							}
						},
						'baspaymenttermfifk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-payment-term-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PaymentTerm',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-payment-term-lookup'
								},
								width: 150
							}
						},
						'baspaymenttermpafk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-payment-term-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PaymentTerm',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-payment-term-lookup'
								},
								width: 170
							}
						},
						'prcincotermfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-incoterm-combobox',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupField: 'PrcIncotermFk',
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-incoterm-combobox'
								},
								width: 125,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prcincoterm',
									displayMember: 'Code'
								}
							}
						},
						'address': {
							'detail': {
								'type': 'directive',
								'directive': 'procurement-common-address-complex-control',
								'options': {
									titleField: 'procurement.common.prcItemDeliveryAddress',
									foreignKey: 'BasAddressFk',
									popupLookupConfig: {
										dataService: 'procurementCommonPrcItemDataService'
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'procurement-common-address-complex-control',
									lookupOptions: {
										foreignKey: 'BasAddressFk',
										titleField: 'cloud.common.entityDeliveryAddress',
										popupLookupConfig: {
											dataService: 'procurementCommonPrcItemDataService'
										}
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'AddressLine'
								},
								width: 150
							}
						},
						'safetyleadtime': {
							editor: 'quantity'
						},
						'bufferleadtime': {
							editor: 'quantity'
						},
						'totalleadtime': {
							'readonly': true
						},
						'hastext': {
							'readonly': true,
							'mandatory': true
						},
						'supplierreference': {
							'mandatory': true
						},
						'batchno': {
							'readonly': true,
							'mandatory': true
						},
						'bpdagreementfk': {
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-agreement-lookup',
								'options': {
									filterKey: 'procurement-common-item-agreement-filter',
									showClearButton: true
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Agreement',
									displayMember: 'Description'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'procurement-common-item-agreement-filter',
										showClearButton: true
									},
									directive: 'business-partner-main-agreement-lookup'
								},
								width: 100
							}
						},
						'quantityaskedfor': {
							'readonly': true,
							'mandatory': true
						},
						'quantitydelivered': {
							'readonly': true,
							'mandatory': true
						},
						'hasscope': {
							'readonly': true,
							'mandatory': true
						},
						'prjstockfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectStockLookupDataService',
							enableCache: true,
							valMember: 'Id',
							dispMember: 'Code',
							filterKey: 'procurement-common-item-stock-type-filter',
							filter: function (item) {
								var prj = {PKey1: null, PKey2: null, PKey3: null};
								if (item) {
									prj.PKey2 = item.MaterialStockFk||item.MdcMaterialFk;
								} else {
									var headerSelectedItem = dataServiceFactory.getSelected();
									if (headerSelectedItem) {
										prj.PKey3 = headerSelectedItem.ProjectFk;
									} else {
										prj.PKey3 = 0;
									}
								}
								return prj;
							}
						}),
						'prjstocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
							'projectFk': 'ProjectFk',
							projectFkReadOnly: false,
							getAdditionalEntity: function (item) {
								let prj = null;
								if (item) {
									let mainService = moduleContext.getMainService();
									let headerSelectedItem = mainService.getSelected();

									// let headerSelectedItem = dataServiceFactory.getSelected();
									if (headerSelectedItem) {
										prj = headerSelectedItem.ProjectFk;
									}
								}
								return {'ProjectFk': prj};
							}
						}, {
							'projectStockFk': 'PrjStockFk',
							projectStockFkReadOnly: false,
							getAdditionalEntity: function (item) {
								if (item) {
									return item;
								}
								return {'PrjStockFk': null};
							}
						}]),
						/*
						'prjstocklocationfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectStockLocationLookupDataService',
							enableCache: true,
							valMember: 'Id',
							dispMember: 'Code',
							filter: function (item) {
								var prj = {PKey1: null, PKey2: null};
								if (item) {
									prj.PKey1 = item.PrjStockFk;
								} else {
									var headerSelectedItem = dataServiceFactory.getSelected();
									if (headerSelectedItem) {
										prj.PKey2 = headerSelectedItem.ProjectFk;
									} else {
										prj.PKey2 = 0;
									}

								}
								return prj;
							}
						}),
*/
						'CommentContractor': {
							'grid': {
								formatter: 'remark',
								editor: 'remark'
							},
							'detail': {
								type: 'remark'
							}
						},
						'CommentClient': {
							'grid': {
								formatter: 'remark',
								editor: 'remark'
							},
							'detail': {
								type: 'remark'
							}
						},
						'quantityremaining': {
							'readonly': true,
							'width': 120
						},
						'controllinggrpsetfk': {
							'readonly': true,
							'detail': {
								visible: false
							},
							'grid': {
								field: 'image',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'controllingStructureGrpSetDTLActionProcessor'
								}
							}
						},
						'discountsplit': {
							'readonly': true
						},
						'discountsplitoc': {
							'readonly': true
						},
						'totalgross': {
							'mandatory': true
						},
						'totalgrossoc': {
							'mandatory': true
						},
						'totalpricegross': {
							'readonly': true
						},
						'totalpricegrossoc': {
							'readonly': true
						},
						'isdisabled': {
							'readonly': true
						},
						'iscontracted':{
							'readonly': true
						},
						'resrequisitionfk': {
							navigator: {
								moduleName: 'resource.requisition'
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										lookupType: 'resourceRequisition',
										showClearButton: true,
										defaultFilter: {resourceFk: 'ResourceFk'}
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
									lookupOptions: {
										defaultFilter: {resourceFk: 'ResourceFk'}
									}
								}
							}
						},
						'notsubmitted':{
							'grid': {
								formatter: 'boolean',
								editor: 'boolean'
							},
							'detail': {
								type: 'boolean'
							}
						},
						'co2projecttotal':{
							'readonly': true
						},
						'co2sourcetotal':{
							'readonly': true
						},
						'co2source':{
							'readonly': true
						},
						'prjchangefk':       procurementItemProjectChangeService.getPrjChangeConfig(),
						'prjchangestatusfk': procurementItemProjectChangeService.getPrjChangeStatusConfig()
					},
					'addition': {
						'grid': extendGrouping([{
							'lookupDisplayColumn': true,
							'field': 'PrcPackageFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.common.prcItemPackageDescription',
							'width': 120
						}, {
							'lookupDisplayColumn': true,
							'field': 'PrcStructureFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'width': 120
						},
						{
							'lookupDisplayColumn': true,
							'field': 'MdcControllingunitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'width': 150
						}, {
							'lookupDisplayColumn': true,
							'field': 'MdcTaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 120
						},
						{
							'lookupDisplayColumn': true,
							'field': 'PrcIncotermFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityIncotermCodeDescription',
							'width': 120
						},
						{
							'lookupDisplayColumn': true,
							'field': 'BasPaymentTermFiFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermFiDescription',
							'width': 170
						}, {
							'lookupDisplayColumn': true,
							'field': 'BasPaymentTermPaFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermPaDescription',
							'width': 170
						}, {
							'lookupDisplayColumn': true,
							'field': 'BasItemType85Fk',
							'displayMember': 'DescriptionInfo.Translated',
							'name': 'Alternative Bid Description',
							'name$tr$': 'procurement.common.alternativeBidDescription',
							'width': 170
						}, {
							'id': 'MaterialCatalogCode',
							'field': 'MaterialCatalogCode',
							'name': 'Material Catalog Code',
							'name$tr$': 'procurement.common.prcItemMaterialCatalogCode',
							'width': 170
						}, {
							'id': 'MaterialCatalogDescription',
							'field': 'MaterialCatalogDescription',
							'name': 'Material Catalog Description',
							'name$tr$': 'procurement.common.prcItemMaterialCatalogDescription',
							'width': 170,
							'formatter': basicsCommonComplexFormatter,
						}, {
							'id': 'MaterialCatalogSupplier',
							'field': 'MaterialCatalogSupplier',
							'name': 'Material Catalog Supplier',
							'name$tr$': 'procurement.common.prcItemMaterialCatalogSupplier',
							'width': 170,
							'formatter': basicsCommonComplexFormatter
						}, {
							'id': 'MaterialCatalogTypeFk',
							'field': 'MaterialCatalogTypeFk',
							'name': 'Material Catalog Type',
							'name$tr$': 'procurement.common.prcItemMaterialCatalogType',
							'formatter': 'lookup',
							'formatterOptions': {
								lookupSimpleLookup: true,
								lookupModuleQualifier: 'basics.materialcatalog.type',
								displayMember: 'Description',
								valueMember: 'Id',
								lookupType: 'basics.materialcatalog.type'
							}
						},
						{
							lookupDisplayColumn: true,
							field: 'MaterialStockFk',
							name$tr$: 'procurement.common.prcItemMaterialStockDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 150
						}
						]),
						'detail': [{
							afterId: 'materialexternalcode',
							rid: 'materialcatalogcode',
							gid: 'basicData',
							model: 'MaterialCatalogCode',
							label: 'Material Catalog Code',
							label$tr$: 'procurement.common.prcItemMaterialCatalogCode',
							type: 'description',
							readonly: true
						}, {
							afterId: 'materialcatalogcode',
							rid: 'materialcatalogdescription',
							gid: 'basicData',
							model: 'MaterialCatalogDescription',
							label: 'Material Catalog Description',
							label$tr$: 'procurement.common.prcItemMaterialCatalogDescription',
							type: 'description',
							readonly: true
						}, {
							afterId: 'materialcatalogdescription',
							rid: 'materialcatalogsupplier',
							gid: 'basicData',
							model: 'MaterialCatalogSupplier',
							label: 'Material Catalog Supplier',
							label$tr$: 'procurement.common.prcItemMaterialCatalogSupplier',
							type: 'description',
							readonly: true
						}, {
							afterId: 'materialcatalogsupplier',
							rid: 'materialcatalogtypefk',
							gid: 'basicData',
							type: 'directive',
							model: 'MaterialCatalogTypeFk',
							label: 'Material Catalog Type',
							label$tr$: 'procurement.common.prcItemMaterialCatalogType',
							directive: 'basics-lookupdata-simple',
							options: {
								lookupType: 'basics.customize.language',
								lookupModuleQualifier: 'basics.materialcatalog.type',
								displayMember: 'Description',
								valueMember: 'Id',
								readonly: true
							},
							readonly: true
						}]
					}
				};
				basRoundingDataService.uiRoundingConfig(layout);

				return layout;
			}
		]);

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});

		return gridColumns;
	}

	angular.module(modName).factory('procurementCommonItemUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonItemLayout', 'platformSchemaService', 'platformUIStandardExtentService', 'procurementContextService', 'basicsCommonRoundingService', '$injector',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService, moduleContext, roundingService, $injector) { // jshint ignore:line

				let basRoundingDataService = roundingService.getService('basics.material');
				let basRoundType = basRoundingDataService.getBasRoundType();
				var copyData = function (data) {
					return angular.element.extend(true, {}, data);
				};
				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemDto',
					moduleSubModule: 'Procurement.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				// override getStandardConfigForDetailView
				var $details = service.getStandardConfigForDetailView();
				var $grids = service.getStandardConfigForListView();
				// I have to do it to support dynamic cost group solution because "copyData" logic
				var cache = {
					detail: {},
					grid: {}
				};
				const totalCallOffWaringSignHtml = '<i style="color: red; font-weight: bold; padding:0 4px">></i>';

				function getDecimalPlacesOption(){
					return {
						decimalPlaces: function (columnDef, field) {
							return basRoundingDataService.getDecimalPlaces(field);
						}
					};
				}

				function getUnitRateDecimalPlaces() {
					return {
						decimalPlaces: function () {
							return basRoundingDataService.getDecimalPlacesByColumnId(basRoundType.UnitRate);
						}
					};
				}

				let discountAbsoluteFields = ['discountabsolute', 'discountabsoluteoc', 'discountabsolutegross', 'discountabsolutegrossoc'];
				service.getStandardConfigForDetailView = function (moduleName) {
					var details = copyData($details);
					moduleName = moduleName || moduleContext.getModuleName();

					if (!_.isNil(moduleName) && cache.detail[moduleName] !== null && cache.detail[moduleName] !== undefined) {
						return cache.detail[moduleName];
					}
					discountAbsoluteFields.forEach(f => {
						const row = details.rows.find(c => c.model.toLowerCase() === f.toLowerCase());
						if (row) {
							row.options = getUnitRateDecimalPlaces();
						}
					});
					if(moduleName==='procurement.package'){
						details.rows.push({
							gid: 'basicData',
							label: 'Quantity Delivered(UI)',
							label$tr$: 'procurement.common.prcItemQuantityDeliveredUi',
							model: 'QuantityDeliveredUi',
							readonly: true,
							options: getDecimalPlacesOption(),
							rid: 'quantitydeliveredui',
							type: 'quantity',
							width: 120
						});
						details.rows.push({
							gid: 'basicData',
							label: 'Quantity Remaining(UI)',
							label$tr$: 'procurement.common.prcItemQuantityRemainingUi',
							model: 'QuantityRemainingUi',
							readonly: true,
							options: getDecimalPlacesOption(),
							rid: 'quantityremainingui',
							type: 'quantity',
							width: 120
						});
					}
					if(moduleName==='procurement.contract'){
						details.rows=_.filter(details.rows,function(item){return item.rid!=='iscontracted';});
						details.rows.push({
							gid: 'basicData',
							label: 'Contract Grand Quantity',
							label$tr$: 'procurement.common.prcItemContractGrandQuantity',
							model: 'ContractGrandQuantity',
							readonly: true,
							options: getDecimalPlacesOption(),
							rid: 'contractgrandquantity',
							type: 'quantity',
							width: 120
						});
						details.rows.push({
							gid: 'basicData',
							label: 'Total CallOff Quantity',
							label$tr$: 'procurement.common.prcItemTotalCallOffQuantity',
							model: 'TotalCallOffQuantity',
							readonly: true,
							rid: 'totalcalloffquantity',
							width: 120,
							type: 'directive',
							directive: 'prc-common-item-total-call-off-quantity-directive',
							options: _.assign({
								comparisonField: 'ContractGrandQuantity',
								warningSignHtml: totalCallOffWaringSignHtml
							}, getDecimalPlacesOption())
						});
						details.rows.push({
							gid: 'basicData',
							label: 'Remaining Quantity For CallOff',
							label$tr$: 'procurement.common.remainingQuantityForCallOff',
							model: 'RemainingQuantityForCallOff',
							readonly: true,
							options: getDecimalPlacesOption(),
							rid: 'remainingquantityforcalloff',
							type: 'quantity',
							width: 120
						});
					}

					if (moduleName === 'procurement.quote' && !_.some(details.rows, function (i) {
						return i.rid === 'itemEvaluationFk';
					})) {
						details.rows.push({
							'gid': details.groups[0].gid,
							'rid': 'itemEvaluationFk',
							'model': 'PrcItemEvaluationFk',
							'label': 'Item Evaluation',
							'label$tr$': 'cloud.common.entityItemEvaluation',
							'type': 'directive',
							'directive': 'procurement-common-prc-item-evaluation-combobox',
							'options': {
								filterKey: 'procurement-common-item-evaluation-filter',
								showClearButton: true,
								decimalPlaces: function (columnDef, field) {
									return basRoundingDataService.getDecimalPlaces(field);
								}
							}
						});
					}
					if (moduleName === 'procurement.quote' && !_.some(details.rows, function (i) {
						return i.rid === 'exqtnisevaluated';
					})){
						details.rows.push({
							gid: 'basicData',
							label: 'Evaluated',
							label$tr$: 'procurement.common.exQtnIsEvaluated',
							model: 'ExQtnIsEvaluated',
							readonly: true,
							options: getDecimalPlacesOption(),
							rid: 'exqtnisevaluated',
							type: 'boolean',
							width: 120
						});
					}
					if (!_.isNil(moduleName)) {
						cache.detail[moduleName] = details;
					}
					return details;
				};

				service.getStandardConfigForListView = function (moduleName) {
					var grids = copyData($grids);
					moduleName = moduleName || moduleContext.getModuleName();

					if (moduleName && cache.grid[moduleName]) {
						return cache.grid[moduleName];
					}
					discountAbsoluteFields.forEach(f => {
						const column = grids.columns.find(c => c.id.toLowerCase() === f.toLowerCase());
						if (column) {
							column.formatterOptions = getUnitRateDecimalPlaces();
							column.editorOptions = getUnitRateDecimalPlaces();
						}
					});
					if(moduleName==='procurement.package'){
						grids.columns.push({
							editor: null,
							name: 'Quantity Delivered(UI)',
							name$tr$: 'procurement.common.prcItemQuantityDeliveredUi',
							field: 'QuantityDeliveredUi',
							readonly: true,
							id: 'quantitydeliveredui',
							formatter: 'quantity',
							formatterOptions: getDecimalPlacesOption(),
							width: 120
						});
						grids.columns.push({
							editor: null,
							name: 'Quantity Remaining(UI)',
							name$tr$: 'procurement.common.prcItemQuantityRemainingUi',
							field: 'QuantityRemainingUi',
							readonly: true,
							id: 'quantityremainingui',
							formatter: 'quantity',
							formatterOptions: getDecimalPlacesOption(),
							width: 120
						});
					}
					if(moduleName==='procurement.contract'){
						grids.columns=_.filter(grids.columns,function(item){return item.id!=='iscontracted';});
						grids.columns.push({
							editor: null,
							field: 'ContractGrandQuantity',
							formatter: 'quantity',
							formatterOptions: getDecimalPlacesOption(),
							id: 'contractgrandquantity',
							name: 'Contract Grand Quantity',
							name$tr$: 'procurement.common.prcItemContractGrandQuantity',
							readonly: true,
							toolTip: 'Contract Grand Quantity',
							toolTip$tr$: 'procurement.common.prcItemContractGrandQuantity',
							width: 120
						});
						grids.columns.push({
							editor: null,
							field: 'TotalCallOffQuantity',
							formatterOptions: getDecimalPlacesOption(),
							id: 'totalcalloffquantity',
							name: 'Total CallOff Quantity',
							name$tr$: 'procurement.common.prcItemTotalCallOffQuantity',
							readonly: true,
							toolTip: 'Total CallOff Quantity',
							toolTip$tr$: 'procurement.common.prcItemTotalCallOffQuantity',
							width: 120,
							formatter: function highlightColumn(row, cell, value, columnDef, dataContext) {
								value = !_.isNil(value) ? value : dataContext[columnDef.field];
								const showWarningSign = dataContext && _.isNumber(dataContext.ContractGrandQuantity) && (value > dataContext.ContractGrandQuantity);
								const formatterVal = $injector.get('platformGridDomainService').formatter('money')(row, cell, value, columnDef);
								return '<div style="width: 100%; height: 100%; top: 0;left: 0; text-align: right; box-sizing: border-box;"><span style="display: ' + (showWarningSign ? 'inline-block;' : 'none;') + '">' + totalCallOffWaringSignHtml + '</span>' + formatterVal + '</div>'
							}
						});
						grids.columns.push({
							editor: null,
							field: 'RemainingQuantityForCallOff',
							formatter: 'quantity',
							formatterOptions: getDecimalPlacesOption(),
							id: 'remainingquantityforcalloff',
							name: 'Remaining Quantity For CallOff',
							name$tr$: 'procurement.common.remainingQuantityForCallOff',
							readonly: true,
							toolTip: 'Remaining Quantity For CallOff',
							toolTip$tr$: 'procurement.common.remainingQuantityForCallOff',
							width: 120
						});
					}
					if (moduleName === 'procurement.quote' && !_.some(grids.columns, function (i) {
						return i.id === 'itemEvaluationFk';
					})) {
						grids.columns.push({
							id: 'itemEvaluationFk',
							field: 'PrcItemEvaluationFk',
							name: 'Item Evaluation',
							name$tr$: 'cloud.common.entityItemEvaluation',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcItemEvaluation',
								displayMember: 'DescriptionInfo.Translated',
								decimalPlaces: function (columnDef, field) {
									return basRoundingDataService.getDecimalPlaces(field);
								}
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'procurement-common-item-evaluation-filter',
									showClearButton: true,
									decimalPlaces: function (columnDef, field) {
										return basRoundingDataService.getDecimalPlaces(field);
									}
								},
								directive: 'procurement-common-prc-item-evaluation-combobox'
							},
							width: 100,
							grouping: {
								title: 'cloud.common.entityItemEvaluation',
								getter: 'PrcItemEvaluationFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					}
					if (moduleName === 'procurement.quote' && !_.some(grids.columns, function (i) {
						return i.id === 'exqtnisevaluated';
					})) {
						grids.columns.push({
							editor: null,
							field: 'ExQtnIsEvaluated',
							formatter: 'boolean',
							formatterOptions: getDecimalPlacesOption(),
							id: 'exqtnisevaluated',
							name: 'Evaluated',
							name$tr$: 'procurement.common.exQtnIsEvaluated',
							readonly: true,
							width: 120,
							grouping: {
								title: 'procurement.common.exQtnIsEvaluated',
								getter: 'ExQtnIsEvaluated',
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					}
					if (moduleName) {
						cache.grid[moduleName] = grids;
					}
					return grids;
				};

				return service;
			}
		]);
})();
