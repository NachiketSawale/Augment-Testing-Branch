/*
 * Copyright(c) RIB Software GmbH
 */

export enum StockAccrualMode {
	OneTransactionPerStockTransaction= 1,
	OneTransactionPerStockHeader,
	ConsolidatedByCUAccount,
	ConsolidatedByAccount,
}
