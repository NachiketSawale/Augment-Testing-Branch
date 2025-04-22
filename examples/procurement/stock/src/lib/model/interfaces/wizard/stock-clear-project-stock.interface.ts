/*
 * Copyright(c) RIB Software GmbH
 */

export interface IProjectStockResult {
	Id: number;
	Code: string;
	Description: string;
	Address: string;
	Total: number;
	Quantity: number;
	ProvisionTotal: number;
	ProjectId: number;
}

export interface IClearProjectStockOptions{
	StockResults: IProjectStockResult[];
	TransactionDate: Date;
	TransactionTypeId: number | null;
}