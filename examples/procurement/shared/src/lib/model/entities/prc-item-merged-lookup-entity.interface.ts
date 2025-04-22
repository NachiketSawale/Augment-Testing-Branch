/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

/**
 * PrcItemMergedLookupEntity
 */
export interface IPrcItemMergedLookupEntity extends IEntityIdentification {
	Description1?: string | null;
	Description2?: string | null;
	PriceValue?: number;
	Itemno?: string;
	PrjStockFk?: number | null;
	PrjStockLocationFk?: number | null;
	Specification?: string;
	MaterialDescription?: string | null;
	Material2Uoms?: string | null;
	ConHeaderExchangeRate?: number;
	ConVatPercent?: number;
	BudgetPerUnit?: number;
	BudgetFixedTotal?: boolean;
	BudgetFixedUnit?: boolean;
	BudgetTotal?: number;
	MaterialStockFk?: number | null;
	QuantityContractedAccepted?: number;
	PrcStructureFk?: number;
	PrcItemStatusFk?: number;
	InstanceId?: number;
	IsCanceled?: boolean;
	IsDelivered?: boolean;
	ItemNO?: number;
	DescriptionInfo1?: IDescriptionInfo;
	DescriptionInfo2?: IDescriptionInfo;
	Quantity?: number;
	PrcItemDescription?: string | null;
	Uom?: string;
	PrcItemDescription2?: string | null;
	Price?: number;
	PriceExtra?: number;
	BasUomPriceUnit?: string;
	FactorPriceUnit?: number;
	TaxCodeFk?: number;
	PriceGross?: number;
	PriceGrossOc?: number;
	ControllingUnitFk?: number;
	MdcMaterialFk?: number | null;
	BasUomFk?: number;
	PrcHeaderFk?: number;
	TaxCodeVatPercent?: number;
	PriceOc?: number;
	PriceExtraOc?: number;
	PriceUnit?: number;
	PrcItemFk?: number;
	PrcPriceConditionFk?: number | null;
	MaterialCode?: string | null;
	BasItemType2Fk?: number;
	MaterialExternalCode?: string | null;
	Discount?: number;
	BasItemTypeFk?: number;
	UserDefined1?: string | null;
	UserDefined2?: string | null;
	UserDefined3?: string | null;
	UserDefined4?: string | null;
	UserDefined5?: string | null;
	DiscountSplit?: number;
	DiscountSplitOc?: number;
	TotalPrice?: number;
	TotalPriceOc?: number;
	ExternalCode?: string | null;
	PrcItemMaterialExternalCode?: string | null;
	Total?: number;
	TotalOc?: number;
	TotalGross?: number;
	TotalGrossOc?: number;
	TotalPriceGross?: number;
	TotalPriceGrossOc?: number;
	AlternativeUomFk?: number | null;
	AlternativeQuantity?: number;
	JobCode?: string | null;
	JobDescription?: string | null;
	PrcPackageFk?: number;
	Co2Project?: string | null;
	Co2ProjectTotal?: number;
	Co2SourceTotal?: number;
	Co2Source?: string | null;
	DiscountAbsolute?: number;
	DiscountAbsoluteOc?: number;
	DiscountAbsoluteGross?: number;
	DiscountAbsoluteGrossOc?: number;
	PrjChangeFk?: number | null;
	PrjChangeStatusFk?: number | null;
}
