/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqTextComplementEntity } from '@libs/boq/interfaces';
import { ICustomBoqStructure } from './custom-boq-structure.interface';
import { ICustomBoqStructureDetail } from './custom-boq-structure-detail.interface';
import { IPreviousBoqItemInfo } from './previous-boq-item-info.interface';
import { ICustomQuoteItemBase } from '../custom-quote-item-base.interface';

export interface ICustomBoqItem extends ICustomQuoteItemBase {
	/**
	 * BasItemType2Fk
	 */
	BasItemType2Fk?: number | null;

	/**
	 * BasItemType85Fk
	 */
	BasItemType85Fk?: number | null;

	/**
	 * BasItemTypeFk
	 */
	BasItemTypeFk: number;

	/**
	 * BoqHeaderId
	 */
	BoqHeaderId: number;

	/**
	 * BoqItemId
	 */
	BoqItemId: number;

	/**
	 * BoqItemPrjBoqFk
	 */
	BoqItemPrjBoqFk?: number | null;

	/**
	 * BoqItemPrjItemFk
	 */
	BoqItemPrjItemFk?: number | null;

	/**
	 * BoqItemQtnBoqFk
	 */
	BoqItemQtnBoqFk?: number | null;

	/**
	 * BoqItemQtnItemFk
	 */
	BoqItemQtnItemFk?: number | null;

	/**
	 * BoqItemWicBoqFk
	 */
	BoqItemWicBoqFk?: number | null;

	/**
	 * BoqItemWicItemFk
	 */
	BoqItemWicItemFk?: number | null;

	/**
	 * BoqLineTypeFk
	 */
	BoqLineTypeFk: number;

	/**
	 * BoqStructure
	 */
	BoqStructure?: ICustomBoqStructure | null;

	/**
	 * BoqStructureDetail
	 */
	BoqStructureDetail?: ICustomBoqStructureDetail[] | null;

	/**
	 * Brief
	 */
	Brief?: string | null;

	/**
	 * BudgetDifference
	 */
	BudgetDifference: number;

	/**
	 * BudgetPerUnit
	 */
	BudgetPerUnit: number;

	/**
	 * BudgetTotal
	 */
	BudgetTotal: number;

	/**
	 * BusinessPartnerId
	 */
	BusinessPartnerId: number;

	/**
	 * CommentClient
	 */
	CommentClient?: string | null;

	/**
	 * CommentContractor
	 */
	CommentContractor?: string | null;

	/**
	 * ConfigurationId
	 */
	ConfigurationId: number;

	/**
	 * Cost
	 */
	Cost: number;

	/**
	 * Discount
	 */
	Discount: number;

	/**
	 * DiscountPercent
	 */
	DiscountPercent: number;

	/**
	 * DiscountPercentIt
	 */
	DiscountPercentIt: number;

	/**
	 * DiscountedPrice
	 */
	DiscountedPrice: number;

	/**
	 * DiscountedUnitprice
	 */
	DiscountedUnitprice: number;

	/**
	 * DiscountedUnitpriceOc
	 */
	DiscountedUnitpriceOc: number;

	/**
	 * EvaluationQuoteCode
	 */
	EvaluationQuoteCode?: string | null;

	/**
	 * EvaluationQuoteId
	 */
	EvaluationQuoteId: number;

	/**
	 * EvaluationSourceBoqHeaderId
	 */
	EvaluationSourceBoqHeaderId: number;

	/**
	 * EvaluationSourceBoqItemId
	 */
	EvaluationSourceBoqItemId: number;

	/**
	 * ExternalCode
	 */
	ExternalCode?: string | null;

	/**
	 * ExtraIncrement
	 */
	ExtraIncrement: number;

	/**
	 * ExtraIncrementOc
	 */
	ExtraIncrementOc: number;

	/**
	 * Factor
	 */
	Factor: number;

	/**
	 * FinalDiscount
	 */
	FinalDiscount: number;

	/**
	 * FinalDiscountOc
	 */
	FinalDiscountOc: number;

	/**
	 * Finalgross
	 */
	Finalgross: number;

	/**
	 * FinalgrossOc
	 */
	FinalgrossOc: number;

	/**
	 * Finalprice
	 */
	Finalprice: number;

	/**
	 * FinalpriceOc
	 */
	FinalpriceOc: number;

	/**
	 * FinalpriceOc_BaseAlt
	 */
	FinalpriceOc_BaseAlt: number;

	/**
	 * Finalprice_BaseAlt
	 */
	Finalprice_BaseAlt: number;

	/**
	 * Included
	 */
	Included: boolean;

	/**
	 * IsFreeQuantity
	 */
	IsFreeQuantity: boolean;

	/**
	 * IsLumpsum
	 */
	IsLumpsum: boolean;

	/**
	 * IsUrb
	 */
	IsUrb: boolean;

	/**
	 * ItemTotal
	 */
	ItemTotal: number;

	/**
	 * ItemTotalOc
	 */
	ItemTotalOc: number;

	/**
	 * ItemTotalOc_BaseAlt
	 */
	ItemTotalOc_BaseAlt: number;

	/**
	 * ItemTotal_BaseAlt
	 */
	ItemTotal_BaseAlt: number;

	/**
	 * LinkBoqFk
	 */
	LinkBoqFk?: number | null;

	/**
	 * LinkItemFk
	 */
	LinkItemFk?: number | null;

	/**
	 * LumpsumPrice
	 */
	LumpsumPrice: number;

	/**
	 * MdcMaterialFk
	 */
	MdcMaterialFk?: number | null;

	/**
	 * NotSubmitted
	 */
	NotSubmitted: boolean;

	/**
	 * PrcHeaderId
	 */
	PrcHeaderId: number;

	/**
	 * PrcItemEvaluationFk
	 */
	PrcItemEvaluationFk?: number | null;

	/**
	 * PreviousItem
	 */
	PreviousItem?: IPreviousBoqItemInfo | null;

	/**
	 * Price
	 */
	Price: number;

	/**
	 * PriceOc
	 */
	PriceOc: number;

	/**
	 * Pricegross
	 */
	Pricegross: number;

	/**
	 * PricegrossOc
	 */
	PricegrossOc: number;

	/**
	 * PrjChangeFk
	 */
	PrjChangeFk?: number | null;

	/**
	 * PrjChangeStatusFk
	 */
	PrjChangeStatusFk?: number | null;

	/**
	 * QtnHeaderId
	 */
	QtnHeaderId: number;

	/**
	 * QtnVersion
	 */
	QtnVersion: number;

	/**
	 * Quantity
	 */
	Quantity: number;

	/**
	 * ReqHeaderId
	 */
	ReqHeaderId: number;

	/**
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/**
	 * TextComplement
	 */
	TextComplement?: IBoqTextComplementEntity[] | null;

	/**
	 * UnitRateFrom
	 */
	UnitRateFrom: number;

	/**
	 * UnitRateTo
	 */
	UnitRateTo: number;

	/**
	 * UomFk
	 */
	UomFk: number;

	/**
	 * Urb1
	 */
	Urb1: number;

	/**
	 * Urb1Oc
	 */
	Urb1Oc: number;

	/**
	 * Urb2
	 */
	Urb2: number;

	/**
	 * Urb2Oc
	 */
	Urb2Oc: number;

	/**
	 * Urb3
	 */
	Urb3: number;

	/**
	 * Urb3Oc
	 */
	Urb3Oc: number;

	/**
	 * Urb4
	 */
	Urb4: number;

	/**
	 * Urb4Oc
	 */
	Urb4Oc: number;

	/**
	 * Urb5
	 */
	Urb5: number;

	/**
	 * Urb5Oc
	 */
	Urb5Oc: number;

	/**
	 * Urb6
	 */
	Urb6: number;

	/**
	 * Urb6Oc
	 */
	Urb6Oc: number;

	/**
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/**
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/**
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/**
	 * Userdefined4
	 */
	Userdefined4?: string | null;

	/**
	 * Userdefined5
	 */
	Userdefined5?: string | null;
}
