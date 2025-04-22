/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqTextComplementEntity } from '@libs/boq/interfaces';
import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { ICustomBoqItem } from './custom-boq-item.interface';
import { IExtendableObject } from '../extendable-object.interface';

export interface ICompositeBoqEntity extends ICompositeBaseEntity<ICompositeBoqEntity, ICustomBoqItem> {
	/**
	 * Aan
	 */
	Aan?: string | null;

	/**
	 * Agn
	 */
	Agn?: string | null;

	/**
	 * BasItemType2Fk
	 */
	BasItemType2Fk?: number | null;

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
	 * Brief
	 */
	Brief?: string;

	/**
	 * BudgetDifference
	 */
	BudgetDifference: number | null;

	/**
	 * BusinessPartnerId
	 */
	BusinessPartnerId: number;

	/**
	 * CanCreateQuoteBoqItem
	 */
	CanCreateQuoteBoqItem: boolean;

	/**
	 * ConfigurationId
	 */
	ConfigurationId: number;

	/**
	 * ExQtnIsEvaluated
	 */
	ExQtnIsEvaluated: boolean;

	/**
	 * FinalDiscount
	 */
	FinalDiscount: number;

	/**
	 * FinalDiscountOc
	 */
	FinalDiscountOc: number;

	/**
	 * HasBidderTextComplements
	 */
	HasBidderTextComplements: boolean;

	/**
	 * HasOwnerTextComplements
	 */
	HasOwnerTextComplements: boolean;

	/**
	 * Included
	 */
	Included: boolean;

	/**
	 * IsDisabled
	 */
	IsDisabled: boolean;

	/**
	 * IsLeadDescription
	 */
	IsLeadDescription: boolean;

	/**
	 * IsLumpsum
	 */
	IsLumpsum: boolean;

	/**
	 * IsNoLeadQuantity
	 */
	IsNoLeadQuantity: boolean;

	/**
	 * IsNotApplicable
	 */
	IsNotApplicable: boolean;

	/**
	 * IsQuoteNewItem
	 */
	IsQuoteNewItem: boolean;

	/**
	 * ItemInfo
	 */
	ItemInfo?: string | null;

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
	 * Level
	 */
	Level: number;

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
	 * NotSubmitted
	 */
	NotSubmitted: boolean;

	/**
	 * QuantityAdjustment
	 */
	QuantityAdjustment: number;

	/**
	 * Reference
	 */
	Reference: string;

	/**
	 * TextComplement
	 */
	TextComplement?: IBoqTextComplementEntity[] | null;

	BoqLineType?: string;

	ReqBoqHeaderId?: number;
	ReqBoqItemId?: number;

	Sorting?: number;

	SummaryRowType?: string;

	_rt$Deleted?: boolean;

	finalPriceFields?: IExtendableObject<number>;
}
