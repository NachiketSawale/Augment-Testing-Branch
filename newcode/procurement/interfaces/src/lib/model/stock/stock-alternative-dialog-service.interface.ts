/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';

export interface IStockAlternativeDialogConfig {
	materialId: number;
	stockId?: number | null;
	code?: string | null;
	description?: string | null;
	excludeId?: number | null;
}

/**
 * The common stock alternative dialog service interface
 */
export interface IStockAlternativeDialogService {
	show(config: IStockAlternativeDialogConfig): Promise<void>;
}

/**
 * The lazy injection token for {@link IStockAlternativeDialogService}
 */
export const PROCUREMENT_STOCK_ALTERNATIVE_DIALOG_SERVICE_TOKEN = new LazyInjectionToken<IStockAlternativeDialogService>('procurement.stock.StockAlternativeDialogService');
