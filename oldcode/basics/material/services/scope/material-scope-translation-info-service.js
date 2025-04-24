/**
 * Created by wui on 10/23/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	var cloudCommonModule = 'cloud.common';
	var prcCommonModule = 'procurement.common';
	var basicsProcurementStructureModule = 'basics.procurementstructure';
	var basicsCostGroupsModule = 'basics.costgroups';

	angular.module(moduleName).factory('basicsMaterialScopeTranslationInfoService', [
		function () {
			return {
				translationInfos: {
					'extraModules': [moduleName, cloudCommonModule, prcCommonModule, basicsProcurementStructureModule, basicsCostGroupsModule],
					'extraWords': {
						MatScope: {location: moduleName, identifier: 'entityMatScope', initial: 'Material Scope'},
						DescriptionInfo: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
						BusinessPartnerFk: {
							location: cloudCommonModule,
							identifier: 'entityBusinessPartner',
							initial: 'Business Partner'
						},
						SubsidiaryFk: {
							location: cloudCommonModule,
							identifier: 'entitySubsidiary',
							initial: 'Subsidiary'
						},
						SupplierFk: {location: cloudCommonModule, identifier: 'entitySupplier', initial: 'Supplier'},
						BusinessPartnerProdFk: {
							location: moduleName,
							identifier: 'entityBusinessPartnerProd',
							initial: 'Business Partner - Producer'
						},
						SubsidiaryProdFk: {
							location: moduleName,
							identifier: 'entitySubsidiaryProd',
							initial: 'Business Partner - Producer'
						},
						SupplierProdFk: {
							location: moduleName,
							identifier: 'entitySupplierProd',
							initial: 'Business Partner - Producer'
						},
						CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'},
						UserDefined1: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							param: {p_0: '1'},
							initial: 'User Defined 1'
						},
						UserDefined2: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							param: {p_0: '2'},
							initial: 'User Defined 2'
						},
						UserDefined3: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							param: {p_0: '3'},
							initial: 'User Defined 3'
						},
						UserDefined4: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							param: {p_0: '4'},
							initial: 'User Defined 4'
						},
						UserDefined5: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							param: {p_0: '5'},
							initial: 'User Defined 5'
						},
						IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
						IsSelected: {location: prcCommonModule, identifier: 'entityIsSelected', initial: 'Is Selected'},
						ScopeOfSupplyTypeFk: {
							location: moduleName,
							identifier: 'entityScopeOfSupplyType',
							initial: 'Scope Of Supply Type'
						},
						ItemNo: {location: prcCommonModule, identifier: 'prcItemItemNo', initial: 'prcItemItemNo'},
						PrcStructureFk: {
							location: moduleName,
							identifier: 'materialSearchLookup.htmlTranslate.structure',
							initial: 'Structure'
						},
						Description1Info: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
						Description2Info: {
							location: moduleName,
							identifier: 'record.furtherDescription',
							initial: 'Further Description'
						},
						SpecificationInfo: {
							location: cloudCommonModule,
							identifier: 'EntitySpec',
							initial: 'Specification'
						},
						Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
						UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'},
						Price: {location: cloudCommonModule, identifier: 'entityPrice', initial: 'Price'},
						PriceOc: {
							location: prcCommonModule,
							identifier: 'prcItemPriceCurrency',
							initial: 'prcItemPriceCurrency'
						},
						PrcPriceConditionFk: {
							location: cloudCommonModule,
							identifier: 'entityPriceCondition',
							initial: 'Price Condition'
						},
						PriceExtra: {
							location: moduleName,
							identifier: 'record.priceExtras',
							initial: 'Price Extras'
						},

						PriceExtraOc: {
							location: prcCommonModule,
							identifier: 'prcItemPriceExtrasCurrency',
							initial: 'prcItemPriceExtrasCurrency'
						},
						PriceUnit: {location: cloudCommonModule, identifier: 'entityPriceUnit', initial: 'Price Unit'},
						UomPriceUnitFk: {
							location: cloudCommonModule,
							identifier: 'entityPriceUnitUoM',
							initial: 'Price Unit UoM'
						},
						FactorPriceUnit: {
							location: cloudCommonModule,
							identifier: 'entityFactor',
							initial: 'entityFactor'
						},
						DateRequired: {
							location: cloudCommonModule,
							identifier: 'entityRequiredBy',
							initial: 'entityRequiredBy'
						},
						PaymentTermFiFk: {
							location: cloudCommonModule,
							identifier: 'entityPaymentTermFI',
							initial: 'entityPaymentTermFI'
						},
						PaymentTermPaFk: {
							location: cloudCommonModule,
							identifier: 'entityPaymentTermPA',
							initial: 'entityPaymentTermPA'
						},
						PrcIncotermFk: {
							location: cloudCommonModule,
							identifier: 'entityIncoterms',
							initial: 'entityIncoterms'
						},
						AddressFk: {location: cloudCommonModule, identifier: 'entityAddress', initial: 'Address'},
						HasText: {location: prcCommonModule, identifier: 'prcItemHasText', initial: 'prcItemHasText'},

						SupplierReference: {
							location: prcCommonModule,
							identifier: 'prcItemSupplierReference',
							initial: 'prcItemSupplierReference'
						},
						Trademark: {location: moduleName, identifier: 'entityTrademark', initial: ''},
						QuantityAskedFor: {
							location: prcCommonModule,
							identifier: 'prcItemQuantityAskedfor',
							initial: 'prcItemQuantityAskedfor'
						},
						QuantityDelivered: {
							location: prcCommonModule,
							identifier: 'prcItemQuantityDelivered',
							initial: 'prcItemQuantityDelivered'
						},
						Batchno: {location: prcCommonModule, identifier: 'prcItemBatchno', initial: 'prcItemBatchno'},
						LicCostGroup1Fk: {
							location: prcCommonModule,
							identifier: 'licCostGroup1Fk',
							initial: 'LicCostGroup1'
						},
						LicCostGroup2Fk: {
							location: prcCommonModule,
							identifier: 'licCostGroup2Fk',
							initial: 'LicCostGroup2'
						},
						LicCostGroup3Fk: {
							location: prcCommonModule,
							identifier: 'licCostGroup3Fk',
							initial: 'LicCostGroup3'
						},
						LicCostGroup4Fk: {
							location: prcCommonModule,
							identifier: 'licCostGroup4Fk',
							initial: 'LicCostGroup4'
						},
						LicCostGroup5Fk: {
							location: prcCommonModule,
							identifier: 'licCostGroup5Fk',
							initial: 'LicCostGroup5'
						},
						PrjCostGroup1Fk: {
							location: prcCommonModule,
							identifier: 'prjCostGroup1Fk',
							initial: 'PrjCostGroup1'
						},
						PrjCostGroup2Fk: {
							location: prcCommonModule,
							identifier: 'prjCostGroup2Fk',
							initial: 'PrjCostGroup2'
						},
						PrjCostGroup3Fk: {
							location: prcCommonModule,
							identifier: 'prjCostGroup3Fk',
							initial: 'PrjCostGroup3'
						},
						PrjCostGroup4Fk: {
							location: prcCommonModule,
							identifier: 'prjCostGroup4Fk',
							initial: 'PrjCostGroup4'
						},
						PrjCostGroup5Fk: {
							location: prcCommonModule,
							identifier: 'prjCostGroup5Fk',
							initial: 'PrjCostGroup5'
						},
						PrcTextTypeFk: {
							location: prcCommonModule,
							identifier: 'headerText.prcTextType',
							initial: 'Text Type'
						},
						Total: {location: cloudCommonModule, identifier: 'entityTotal', initial: 'entityTotal'},
						TotalCurrency: {
							location: prcCommonModule,
							identifier: 'prcItemTotalCurrency',
							initial: 'prcItemTotalCurrency'
						},
						MaterialFk: {
							location: moduleName,
							identifier: 'record.material',
							initial: 'Material'
						}
					}
				}
			};
		}
	]);

})(angular);