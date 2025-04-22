/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IMaterial2UomItems } from './material-2uom-item.interface';

export interface IInv2ContractEntityGenerated extends IEntityBase {
	/*
	 * Account
	 */
	Account?: string | null;

	/*
	 * AccountDesc
	 */
	AccountDesc?: string | null;

	/*
	 * AlternativeQuantity
	 */
	AlternativeQuantity?: number | null;

	/*
	 * AlternativeUomFk
	 */
	AlternativeUomFk?: number | null;

	/*
	 * BasItemTypeFk
	 */
	BasItemTypeFk?: number | null;

	/*
	 * BasUomPriceUnit
	 */
	BasUomPriceUnit?: string | null;

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
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk: number;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * ControllinggrpsetFk
	 */
	ControllinggrpsetFk?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * DiscountSplit
	 */
	DiscountSplit: number;

	/*
	 * DiscountSplitOc
	 */
	DiscountSplitOc: number;

	/*
	 * ExpirationDate
	 */
	ExpirationDate?: Date | string | null;

	/*
	 * FactorPriceUnit
	 */
	FactorPriceUnit: number;

	/*
	 * FixedAssetFk
	 */
	FixedAssetFk?: number | null;

	/*
	 * FurtherDescription
	 */
	FurtherDescription?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * IsAssetManagement
	 */
	IsAssetManagement: boolean;

	/*
	 * IsFinalDelivery
	 */
	IsFinalDelivery: boolean;

	/*
	 * IsTotalEdited
	 */
	IsTotalEdited: boolean;

	/*
	 * LotNo
	 */
	LotNo?: string | null;

	/*
	 * Material2Uoms
	 */
	Material2Uoms?: IMaterial2UomItems[] | null;

	/*
	 * MaterialCode
	 */
	MaterialCode?: string | null;

	/*
	 * MaterialDescription
	 */
	MaterialDescription?: string | null;

	/*
	 * MaterialDescription1
	 */
	MaterialDescription1?: string | null;

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
	 * MdcSalesTaxGroupFk
	 */
	MdcSalesTaxGroupFk?: number | null;

	/*
	 * OrderQuantity
	 */
	OrderQuantity: number;

	/*
	 * OrderQuantityConverted
	 */
	OrderQuantityConverted: number;

	/*
	 * PrcBoqFk
	 */
	PrcBoqFk?: number | null;

	/*
	 * PrcItemDiscountSplit
	 */
	PrcItemDiscountSplit: number;

	/*
	 * PrcItemDiscountSplitOc
	 */
	PrcItemDiscountSplitOc: number;

	/*
	 * PrcItemFk
	 */
	PrcItemFk?: number | null;

	/*
	 * PrcItemJobCode
	 */
	PrcItemJobCode?: string | null;

	/*
	 * PrcItemJobDescription
	 */
	PrcItemJobDescription?: string | null;

	/*
	 * PrcItemQuantity
	 */
	PrcItemQuantity?: number | null;

	/*
	 * PrcItemStatusFk
	 */
	PrcItemStatusFk?: number | null;

	/*
	 * PrcItemTotalGross
	 */
	PrcItemTotalGross: number;

	/*
	 * PrcItemTotalGrossOc
	 */
	PrcItemTotalGrossOc: number;

	/*
	 * PrcStockTransactionFk
	 */
	PrcStockTransactionFk?: number | null;

	/*
	 * PrcStockTransactionTypeFk
	 */
	PrcStockTransactionTypeFk?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * Price
	 */
	Price: number;

	/*
	 * PriceOc
	 */
	PriceOc: number;

	/*
	 * PrjStockFk
	 */
	PrjStockFk?: number | null;

	/*
	 * PrjStockLocationFk
	 */
	PrjStockLocationFk?: number | null;

	/*
	 * ProvisionPercent
	 */
	ProvisionPercent: number;

	/*
	 * ProvisionTotal
	 */
	ProvisionTotal: number;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/*
	 * TotalPrice
	 */
	TotalPrice: number;

	/*
	 * TotalPriceOc
	 */
	TotalPriceOc: number;

	/*
	 * TotalValue
	 */
	TotalValue: number;

	/*
	 * TotalValueGross
	 */
	TotalValueGross: number;

	/*
	 * TotalValueGrossOc
	 */
	TotalValueGrossOc: number;

	/*
	 * TotalValueOc
	 */
	TotalValueOc: number;

	/*
	 * Uom
	 */
	Uom?: string | null;
}
