/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemEntityGenerated } from './prc-item-entity-generated.interface';

export interface IPrcItemEntity extends IPrcItemEntityGenerated {

    MaterialStock2UomFk?: number;

	MainExchangeRate?: number;
    
	MainVatPercent?: number;

	IsChangePriceOc?: boolean;

	IsChangePriceGrossOc?: boolean;

	/**
	 * Identity which prc item scope it uses
	 */
	PrcItemScopeFk?: number;
    
	/**
	 * Price before applying scope
	 */
	OriginalPrice?: number;

	/**
	 * PriceOc before applying scope
	 */
	OriginalPriceOc?: number;
}

