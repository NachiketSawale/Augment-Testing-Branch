/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

/**
 * Basics Material Stock Total entity interface
 */
export interface IBasicsStockTotalEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	TotalQuantity?: number;
	TotalValue?: number;
	TotalProvision?: number;
	ExpenseConsumed?: number;
	Expenses?: number;
	OrderProposalStatus?: number;
	LastTransactionDays: string;
	QuantityOnOrder?: number;
	StockLocationFk?: number;
	QuantityTotal?: number;
	PendingQuantity?: number;
	TotalQuantityByPending?: number;
	Specification: string;
	StockLocation: number;
	Stock2matId?: number;
	PrjStockFk: number;
	CatalogCode: string;
	CatalogDescription: string;
	MaterialCode: string;
	CatalogId?: number;
	PrcStructureFk?: number;
	MaterialGroupId?: number;
	MdcMaterialFk: number;
	Description1: string;
	Description2: string;
	BasBlobsFk?: number;
	Modelname: string;
	BrandId?: number;
	BrandDescription: string;
	Quantity: number;
	Total: number;
	ProvisionTotal: number;
	ProvisionPercent?: number;
	ProvisionPeruom?: number;
	Islotmanagement?: boolean;
	MinQuantity?: number;
	MaxQuantity?: number;
	Uom: string;
	QuantityReceipt?: number;
	QuantityConsumed?: number;
	TotalReceipt?: number;
	TotalConsumed?: number;
	QuantityReserved?: number;
	QuantityAvailable?: number;
	ProvisionReceipt?: number;
	ProvisionConsumed?: number;
	ExpenseTotal?: number;
	ProductFk?: number;
	ProductDescription: string;
	ProductCode: string;
	CurrencyFk: number;
	ProjectFk: number;
	ContextFk: number;
	StockCode: string;
	StockDescription: string;
	Currency: string;
	CompanyCode: string;
	CompanyName: string;
	ProjectNo: string;
	ProjectName: string;
}