/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomQuoteItemBase } from '../custom-quote-item-base.interface';
import { IPreviousPrcItemInfo } from './previous-prc-item-info.interface';
import { ICustomReplacementItem } from './custom-replacement-item.interface';

export interface ICustomPrcItem extends ICustomQuoteItemBase {
	/**
	 * AddressFk
	 */
	AddressFk?: number | null;

	/**
	 * BasItemType85Fk
	 */
	BasItemType85Fk?: number | null;

	/**
	 * BudgetFixedTotal
	 */
	BudgetFixedTotal: boolean;

	/**
	 * BudgetFixedUnit
	 */
	BudgetFixedUnit: boolean;

	/**
	 * BudgetPerUnit
	 */
	BudgetPerUnit: number;

	/**
	 * BudgetTotal
	 */
	BudgetTotal: number;

	/**
	 * BufferLeadTime
	 */
	BufferLeadTime: number;

	/**
	 * Co2Project
	 */
	Co2Project?: number | null;

	/**
	 * Co2ProjectTotal
	 */
	Co2ProjectTotal?: number | null;

	/**
	 * Co2Source
	 */
	Co2Source?: number | null;

	/**
	 * Co2SourceTotal
	 */
	Co2SourceTotal?: number | null;

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
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * DateRequired
	 */
	DateRequired?: string | null;

	/**
	 * Description1
	 */
	Description1?: string | null;

	/**
	 * Description2
	 */
	Description2?: string | null;

	/**
	 * Discount
	 */
	Discount: number;

	/**
	 * DiscountAbsolute
	 */
	DiscountAbsolute: number;

	/**
	 * DiscountAbsoluteGross
	 */
	DiscountAbsoluteGross: number;

	/**
	 * DiscountAbsoluteGrossOc
	 */
	DiscountAbsoluteGrossOc: number;

	/**
	 * DiscountAbsoluteOc
	 */
	DiscountAbsoluteOc: number;

	/**
	 * DiscountComment
	 */
	DiscountComment?: string | null;

	/**
	 * DiscountSplit
	 */
	DiscountSplit: number;

	/**
	 * DiscountSplitOc
	 */
	DiscountSplitOc: number;

	/**
	 * EvaluationQuoteCode
	 */
	EvaluationQuoteCode?: string | null;

	/**
	 * EvaluationQuoteId
	 */
	EvaluationQuoteId: number;

	/**
	 * EvaluationSourcePrcItemId
	 */
	EvaluationSourcePrcItemId: number;

	/**
	 * ExternalCode
	 */
	ExternalCode?: string | null;

	/**
	 * FactorPriceUnit
	 */
	FactorPriceUnit: number;

	/**
	 * FactoredQuantity
	 */
	FactoredQuantity: number;

	/**
	 * FactoredTotalPrice
	 */
	FactoredTotalPrice: number;

	/**
	 * HasReplacementItem
	 */
	HasReplacementItem: boolean;

	/**
	 * InstanceId
	 */
	InstanceId: number;

	/**
	 * IsFreeQuantity
	 */
	IsFreeQuantity: boolean;

	/**
	 * ItemAlt
	 */
	ItemAlt?: string | null;

	/**
	 * ItemAltFk
	 */
	ItemAltFk?: number | null;

	/**
	 * ItemNo
	 */
	ItemNo: number;

	/**
	 * ItemType2Fk
	 */
	ItemType2Fk?: number | null;

	/**
	 * ItemTypeFk
	 */
	ItemTypeFk?: number | null;

	/**
	 * LeadTime
	 */
	LeadTime: number;

	/**
	 * LeadTimeExtra
	 */
	LeadTimeExtra: number;

	/**
	 * MdcMaterialFk
	 */
	MdcMaterialFk?: number | null;

	/**
	 * NotSubmitted
	 */
	NotSubmitted: boolean;

	/**
	 * OffHire
	 */
	OffHire?: string | null;

	/**
	 * OnHire
	 */
	OnHire?: string | null;

	/**
	 * PaymentTermFiFk
	 */
	PaymentTermFiFk?: number | null;

	/**
	 * PaymentTermPaFk
	 */
	PaymentTermPaFk?: number | null;

	/**
	 * PrcIncotermFk
	 */
	PrcIncotermFk?: number | null;

	/**
	 * PrcItemEvaluationFk
	 */
	PrcItemEvaluationFk?: number | null;

	/**
	 * PrcPriceConditionFk
	 */
	PrcPriceConditionFk?: number | null;

	/**
	 * PreviousItem
	 */
	PreviousItem?: IPreviousPrcItemInfo | null;

	/**
	 * Price
	 */
	Price: number;

	/**
	 * PriceExtra
	 */
	PriceExtra: number;

	/**
	 * PriceExtraOc
	 */
	PriceExtraOc: number;

	/**
	 * PriceGross
	 */
	PriceGross: number;

	/**
	 * PriceOCGross
	 */
	PriceOCGross: number;

	/**
	 * PriceOc
	 */
	PriceOc: number;

	/**
	 * PriceUnit
	 */
	PriceUnit: number;

	/**
	 * PrjChangeFk
	 */
	PrjChangeFk?: number | null;

	/**
	 * PrjChangeStatusFk
	 */
	PrjChangeStatusFk?: number | null;

	/**
	 * QtnHeaderVatGroupFk
	 */
	QtnHeaderVatGroupFk?: number | null;

	/**
	 * Quantity
	 */
	Quantity: number;

	/**
	 * ReplacementItems
	 */
	ReplacementItems?: ICustomReplacementItem[] | null;

	/**
	 * SafetyLeadTime
	 */
	SafetyLeadTime: number;

	/**
	 * Specification
	 */
	Specification?: string | null;

	/**
	 * StructureFk
	 */
	StructureFk?: number | null;

	/**
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/**
	 * Total
	 */
	Total: number;

	/**
	 * TotalGross
	 */
	TotalGross: number;

	/**
	 * TotalLeadTime
	 */
	TotalLeadTime: number;

	/**
	 * TotalNoDiscount
	 */
	TotalNoDiscount: number;

	/**
	 * TotalOCGross
	 */
	TotalOCGross: number;

	/**
	 * TotalOc
	 */
	TotalOc: number;

	/**
	 * TotalOcNoDiscount
	 */
	TotalOcNoDiscount: number;

	/**
	 * TotalPrice
	 */
	TotalPrice: number;

	/**
	 * TotalPriceGross
	 */
	TotalPriceGross: number;

	/**
	 * TotalPriceOCGross
	 */
	TotalPriceOCGross: number;

	/**
	 * UomFk
	 */
	UomFk: number;

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
