/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

export interface IPrcItemLookupVEntityGenerated {

	/*
	 * AlternativeQuantity
	 */
	AlternativeQuantity?: number | null;

	/*
	 * AlternativeUomFk
	 */
	AlternativeUomFk?: number | null;

	/*
	 * BasItemType2Fk
	 */
	BasItemType2Fk: number;

	/*
	 * BasItemTypeFk
	 */
	BasItemTypeFk: number;

	/*
	 * BasUomFk
	 */
	BasUomFk: number;

	/*
	 * BasUomPriceUnit
	 */
	BasUomPriceUnit: string;

	/*
	 * BudgetFixedTotal
	 */
	BudgetFixedTotal?: boolean | null;

	/*
	 * BudgetFixedUnit
	 */
	BudgetFixedUnit?: boolean | null;

	/*
	 * BudgetPerUnit
	 */
	BudgetPerUnit?: number | null;

	/*
	 * BudgetTotal
	 */
	BudgetTotal?: number | null;

	/*
	 * Co2Project
	 */
	Co2Project?: number | null;

	/*
	 * Co2ProjectTotal
	 */
	Co2ProjectTotal?: number | null;

	/*
	 * Co2Source
	 */
	Co2Source?: number | null;

	/*
	 * Co2SourceTotal
	 */
	Co2SourceTotal?: number | null;

	/*
	 * ConHeaderExchangeRate
	 */
	ConHeaderExchangeRate?: number | null;

	/*
	 * ConVatPercent
	 */
	ConVatPercent?: number | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * Description1
	 */
	Description1?: string | null;

	/*
	 * Description2
	 */
	Description2?: string | null;

	/*
	 * DescriptionInfo1
	 */
	DescriptionInfo1?: IDescriptionInfo | null;

	/*
	 * DescriptionInfo2
	 */
	DescriptionInfo2?: IDescriptionInfo | null;

	/*
	 * Discount
	 */
	Discount: number;

	/*
	 * DiscountAbsolute
	 */
	DiscountAbsolute: number;

	/*
	 * DiscountAbsoluteGross
	 */
	DiscountAbsoluteGross: number;

	/*
	 * DiscountAbsoluteGrossOc
	 */
	DiscountAbsoluteGrossOc: number;

	/*
	 * DiscountAbsoluteOc
	 */
	DiscountAbsoluteOc: number;

	/*
	 * DiscountSplit
	 */
	DiscountSplit: number;

	/*
	 * DiscountSplitOc
	 */
	DiscountSplitOc: number;

	/*
	 * ExternalCode
	 */
	ExternalCode?: string | null;

	/*
	 * FactorPriceUnit
	 */
	FactorPriceUnit: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InstanceId
	 */
	InstanceId: number;

	/*
	 * IsCanceled
	 */
	IsCanceled: boolean;

	/*
	 * IsDelivered
	 */
	IsDelivered: boolean;

	/*
	 * ItemNO
	 */
	ItemNO: number;

	/*
	 * Itemno
	 */
	Itemno?: string | null;

	/*
	 * JobCode
	 */
	JobCode?: string | null;

	/*
	 * JobDescription
	 */
	JobDescription?: string | null;

// /*
//  * Material2Uoms
//  */
//   Material2Uoms?: IMaterial2UomItems[] | null;

	/*
	 * MaterialCode
	 */
	MaterialCode?: string | null;

	/*
	 * MaterialDescription
	 */
	MaterialDescription?: string | null;

	/*
	 * MaterialExternalCode
	 */
	MaterialExternalCode?: string | null;

	/*
	 * MaterialStockFk
	 */
	MaterialStockFk?: number | null;

	/*
	 * MdcMaterialFk
	 */
	MdcMaterialFk?: number | null;

	/*
	 * PrcHeaderFk
	 */
	PrcHeaderFk: number;

	/*
	 * PrcItemDescription
	 */
	PrcItemDescription?: string | null;

	/*
	 * PrcItemDescription2
	 */
	PrcItemDescription2?: string | null;

	/*
	 * PrcItemFk
	 */
	PrcItemFk?: number | null;

	/*
	 * PrcItemMaterialExternalCode
	 */
	PrcItemMaterialExternalCode?: string | null;

	/*
	 * PrcItemStatusFk
	 */
	PrcItemStatusFk: number;

	/*
	 * PrcPackageFk
	 */
	PrcPackageFk?: number | null;

	/*
	 * PrcPriceConditionFk
	 */
	PrcPriceConditionFk?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * Price
	 */
	Price: number;

	/*
	 * PriceExtra
	 */
	PriceExtra: number;

	/*
	 * PriceExtraOc
	 */
	PriceExtraOc: number;

	/*
	 * PriceGross
	 */
	PriceGross: number;

	/*
	 * PriceGrossOc
	 */
	PriceGrossOc: number;

	/*
	 * PriceOc
	 */
	PriceOc: number;

	/*
	 * PriceUnit
	 */
	PriceUnit: number;

	/*
	 * PriceValue
	 */
	PriceValue?: number | null;

	/*
	 * PrjChangeFk
	 */
	PrjChangeFk?: number | null;

	/*
	 * PrjChangeStatusFk
	 */
	PrjChangeStatusFk?: number | null;

	/*
	 * PrjStockFk
	 */
	PrjStockFk?: number | null;

	/*
	 * PrjStockLocationFk
	 */
	PrjStockLocationFk?: number | null;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * QuantityContractedAccepted
	 */
	QuantityContractedAccepted?: number | null;

	/*
	 * Specification
	 */
	Specification?: string | null;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/*
	 * TaxCodeVatPercent
	 */
	TaxCodeVatPercent?: number | null;

	/*
	 * Total
	 */
	Total: number;

	/*
	 * TotalGross
	 */
	TotalGross: number;

	/*
	 * TotalGrossOc
	 */
	TotalGrossOc: number;

	/*
	 * TotalOc
	 */
	TotalOc: number;

	/*
	 * TotalPrice
	 */
	TotalPrice: number;

	/*
	 * TotalPriceGross
	 */
	TotalPriceGross: number;

	/*
	 * TotalPriceGrossOc
	 */
	TotalPriceGrossOc: number;

	/*
	 * TotalPriceOc
	 */
	TotalPriceOc: number;

	/*
	 * Uom
	 */
	Uom: string;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/*
	 * UserDefined5
	 */
	UserDefined5?: string | null;
}
