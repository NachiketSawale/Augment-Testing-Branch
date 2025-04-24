import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IEstPriceAdjustmentItemData extends IEntityBase {
	/*
	 * AqAdjustmentPrice
	 */
	AqAdjustmentPrice?: number | null;

	/*
	 * AqDeltaPrice
	 */
	AqDeltaPrice?: number | null;

	/*
	 * AqEstimatedPrice
	 */
	AqEstimatedPrice?: number | null;

	/*
	 * AqQuantity
	 */
	AqQuantity?: number | null;

	/*
	 * AqTenderPrice
	 */
	AqTenderPrice?: number | null;

	/*
	 * BasCurrencyFk
	 */
	BasCurrencyFk?: number | null;

	/*
	 * BasItemType2Fk
	 */
	BasItemType2Fk?: number | null;

	/*
	 * BasItemTypeFk
	 */
	BasItemTypeFk?: number | null;

	/*
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/*
	 * BoqHeaderFk
	 */
	BoqHeaderFk?: number | null;

	/*
	 * BoqItemFk
	 */
	BoqItemFk?: number | null;

	/*
	 * BoqLineTypeFk
	 */
	BoqLineTypeFk?: number | null;

	/*
	 * ChildrenItems
	 */
	ChildrenItems?: IEstPriceAdjustmentItemData[] | null;

	/*
	 * Comment
	 */
	Comment?: string | null;

	/*
	 * EpnaEstimagted
	 */
	EpnaEstimagted?: number | null;

	/*
	 * EstHeaderFk
	 */
	EstHeaderFk?: number | null;

	/*
	 * EstPriceAdjustmentFk
	 */
	EstPriceAdjustmentFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsAssignedLineItem
	 */
	IsAssignedLineItem?: number | null;

	/*
	 * IsDisabled
	 */
	IsDisabled?: boolean | null;

	/*
	 * IsKeyitem
	 */
	IsKeyitem?: boolean | null;

	/*
	 * IsNotApplicable
	 */
	IsNotApplicable?: boolean | null;

	/*
	 * Reference
	 */
	Reference?: string | null;

	/*
	 * Status
	 */
	Status?: number | null;

	/*
	 * UrAdjustment
	 */
	UrAdjustment?: number | null;

	/*
	 * UrDelta
	 */
	UrDelta?: number | null;

	/*
	 * UrEstimated
	 */
	UrEstimated?: number | null;

	/*
	 * UrTender
	 */
	UrTender?: number | null;

	/*
	 * Urb1Adjustment
	 */
	Urb1Adjustment?: number | null;

	/*
	 * Urb1Delta
	 */
	Urb1Delta?: number | null;

	/*
	 * Urb1Estimated
	 */
	Urb1Estimated?: number | null;

	/*
	 * Urb1Tender
	 */
	Urb1Tender?: number | null;

	/*
	 * Urb2Adjustment
	 */
	Urb2Adjustment?: number | null;

	/*
	 * Urb2Delta
	 */
	Urb2Delta?: number | null;

	/*
	 * Urb2Estimated
	 */
	Urb2Estimated?: number | null;

	/*
	 * Urb2Tender
	 */
	Urb2Tender?: number | null;

	/*
	 * Urb3Adjustment
	 */
	Urb3Adjustment?: number | null;

	/*
	 * Urb3Delta
	 */
	Urb3Delta?: number | null;

	/*
	 * Urb3Estimated
	 */
	Urb3Estimated?: number | null;

	/*
	 * Urb3Tender
	 */
	Urb3Tender?: number | null;

	/*
	 * Urb4Adjustment
	 */
	Urb4Adjustment?: number | null;

	/*
	 * Urb4Delta
	 */
	Urb4Delta?: number | null;

	/*
	 * Urb4Estimated
	 */
	Urb4Estimated?: number | null;

	/*
	 * Urb4Tender
	 */
	Urb4Tender?: number | null;

	/*
	 * Urb5Adjustment
	 */
	Urb5Adjustment?: number | null;

	/*
	 * Urb5Delta
	 */
	Urb5Delta?: number | null;

	/*
	 * Urb5Estimated
	 */
	Urb5Estimated?: number | null;

	/*
	 * Urb5Tender
	 */
	Urb5Tender?: number | null;

	/*
	 * Urb6Adjustment
	 */
	Urb6Adjustment?: number | null;

	/*
	 * Urb6Delta
	 */
	Urb6Delta?: number | null;

	/*
	 * Urb6Estimated
	 */
	Urb6Estimated?: number | null;

	/*
	 * Urb6Tender
	 */
	Urb6Tender?: number | null;

	/*
	 * WqAdjustmentPrice
	 */
	WqAdjustmentPrice?: number | null;

	/*
	 * WqDeltaPrice
	 */
	WqDeltaPrice?: number | null;

	/*
	 * WqEstimatedPrice
	 */
	WqEstimatedPrice?: number | null;

	/*
	 * WqQuantity
	 */
	WqQuantity?: number | null;

	/*
	 * WqTenderPrice
	 */
	WqTenderPrice?: number | null;

	/*
	 * BoqItems
	 */
	BoqItems?: IEstPriceAdjustmentItemData[];

	/*
	 * HasChildren
	 */
	HasChildren?: boolean;

	/*
	 * image
	 */
	image?: string | null;

	/*
	 * BriefInfo
	 */
	BriefInfo?: IDescriptionInfo | null;

	/*
	 * IsRoot
	 */
	IsRoot?: boolean;

	/*
	 * Reference2
	 */
	Reference2?: string | null;

	/*
	 * BoqItemFlagFk
	 */
	BoqItemFlagFk?: number | null;

	/*
	 * Factor
	 */
	Factor?: number | null;

	/*
	 * StatusImage
	 */
	StatusImage?: string | null;

	/*
	 * ItemInfo
	 */
	ItemInfo?: string | null;

	/*
	 * IsUrb
	 */
	IsUrb?: boolean;

	QuantityAdj?: number | null;
}
