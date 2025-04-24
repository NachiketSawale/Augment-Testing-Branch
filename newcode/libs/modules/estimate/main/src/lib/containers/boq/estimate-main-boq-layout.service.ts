/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainBoqLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IBoqItemEntity>> {
		return {
			groups: [
				{
					gid: 'boqs',
					title: {
						text: 'BoQs',
						key: 'estimate.main.boq.boqList',
					},
					attributes: ['BriefInfo', 'Reference', 'Quantity', 'BasUomFk', 'Price', 'Finalprice', 'BoqDivisionTypeFk', 'ANN', 'AGN', 'Reference2', 'PrjCharacter', 'WorkContent', 'BoqLineTypeFk', 'DesignDescriptionNo', 'BoqItemWicBoqFk', 'FactorDetail', 'DiscountText', 'CommentContractor', 'CommentClient', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'ExternalCode', 'ExternalUom', 'Factor', 'Cost', 'Correction', 'Pricegross', 'DiscountedPrice', 'Finaldiscount', 'Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6', 'UnitRateFrom', 'UnitRateTo', 'LumpsumPrice', 'Discount', 'QuantityAdj', 'QuantityAdjDetail', 'HoursUnit', 'Hours', 'DiscountPercent', 'IsUrb', 'IsLumpsum', 'IsDisabled', 'IsNotApplicable', 'IsKeyitem', 'IsSurcharged', 'IsFreeQuantity', 'IsUrFromSd', 'IsFixedPrice', 'IsNoMarkup', 'IsCostItem', 'Included', 'PrcStructureFk', 'MdcTaxCodeFk', 'BpdAgreementFk', 'BasItemTypeFk', 'BasItemType2Fk', 'MdcMaterialFk', 'MdcCostCodeFk', 'MdcControllingUnitFk', 'PrcItemEvaluationFk', 'PrjLocationFk', 'CalculateQuantitySplitting', 'BudgetFixedUnit', 'BudgetFixedTotal', 'BudgetDifference']
				}
			],
			labels: {
				...prefixAllTranslationKeys('boq.main.', {
					Reference: { key: 'Reference' },
					Quantity: { key: 'Quantity' },
					Price: { key: 'Price' },
					Finalprice: { key: 'Finalprice' },
					BoqDivisionTypeFk: { key: 'BoqDivisionTypeFk' },
					BriefInfo: { key: 'BriefInfo' },
					ANN: { key: 'ANN' },
					AGN: { key: 'AGN' },
					Reference2: { key: 'Reference2' },
					PrjCharacter: { key: 'PrjCharacter' },
					WorkContent: { key: 'WorkContent' },
					BoqLineTypeFk: { key: 'BoqLineTypeFk' },
					DesignDescriptionNo: { key: 'DesignDescriptionNo' },
					BoqItemWicBoqFk: { key: 'WicNumber' },
					FactorDetail: { key: 'FactorDetail' },
					DiscountText: { key: 'DiscountText' },
					BoqItemReferenceFk: { key: 'BoqItemReferenceFk' },
					CommentContractor: { key: 'CommentContractor' },
					CommentClient: { key: 'CommentClient' },
					Userdefined1: { key: 'Userdefined1' },
					Userdefined2: { key: 'Userdefined2' },
					Userdefined3: { key: 'Userdefined3' },
					Userdefined4: { key: 'Userdefined4' },
					Userdefined5: { key: 'Userdefined5' },
					ExternalCode: { key: 'ExternalCode' },
					ExternalUom: { key: 'ExternalUom' },
					Factor: { key: 'Factor' },
					Cost: { key: 'Cost' },
					Correction: { key: 'Correction' },
					Pricegross: { key: 'Pricegross' },
					DiscountedPrice: { key: 'DiscountedPrice' },
					Finaldiscount: { key: 'Finaldiscount' },
					Urb1: { key: 'Urb1' },
					Urb2: { key: 'Urb2' },
					Urb3: { key: 'Urb3' },
					Urb4: { key: 'Urb4' },
					Urb5: { key: 'Urb5' },
					Urb6: { key: 'Urb6' },
					UnitRateFrom: { key: 'UnitRateFrom' },
					UnitRateTo: { key: 'UnitRateTo' },
					LumpsumPrice: { key: 'LumpsumPrice' },
					Discount: { key: 'Discount' },
					QuantityAdj: { key: 'QuantityAdj' },
					QuantityAdjDetail: { key: 'QuantityAdjDetail' },
					HoursUnit: { key: 'HoursUnit' },
					Hours: { key: 'Hours' },
					DiscountPercent: { key: 'DiscountPercent' },
					IsUrb: { key: 'IsUrb' },
					IsLumpsum: { key: 'IsLumpsum' },
					IsDisabled: { key: 'IsDisabled' },
					IsNotApplicable: { key: 'IsNotApplicable' },
					IsKeyitem: { key: 'IsKeyitem' },
					IsSurcharged: { key: 'IsSurcharged' },
					IsFreeQuantity: { key: 'IsFreeQuantity' },
					IsUrFromSd: { key: 'IsUrFromSd' },
					IsFixedPrice: { key: 'IsFixedPrice' },
					IsNoMarkup: { key: 'IsNoMarkup' },
					IsCostItem: { key: 'IsCostItem' },
					Included: { key: 'Included' },
					PrcStructureFk: { key: 'PrcStructureFk' },
					MdcTaxCodeFk: { key: 'TaxCodeFk' },
					BpdAgreementFk: { key: 'BpdAgreementFk' },
					BasItemTypeFk: { key: 'BasItemTypeFk' },
					BasItemType2Fk: { key: 'BasItemType2Fk' },
					MdcMaterialFk: { key: 'MdcMaterialFk' },
					MdcCostCodeFk: { key: 'MdcCostCodeFk' },
					MdcControllingUnitFk: { key: 'MdcControllingUnitFk' },
					PrcItemEvaluationFk: { key: 'PrcItemEvaluationFk' },
					PrjLocationFk: { key: 'PrjLocationFk' },
					CalculateQuantitySplitting: { key: 'CalculateQuantitySplitting' },
					BudgetFixedUnit: { key: 'BudgetFixedUnit' },
					BudgetFixedTotal: { key: 'BudgetFixedTotal' },
					BudgetDifference: { key: 'BudgetDifference' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					BasUomFk: { key: 'entityUoM' }
				})
			},
			overloads: {
				BriefInfo: {
					type: FieldType.Translation,
					formatterOptions: {
						field: 'BriefInfo.Translated'
					}
				}
			}
		};
	}
}
