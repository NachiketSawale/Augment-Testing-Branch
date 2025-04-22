/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupImageSelector, LookupImageIconType } from '@libs/ui/common';
import { IBasicsCustomizePrcStockTransactionTypeEntity } from '@libs/basics/interfaces';

/**
 * Image selector for stock transaction type
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTransactionTypeIconService<TEntity extends object> implements ILookupImageSelector<IBasicsCustomizePrcStockTransactionTypeEntity, TEntity> {
	private readonly icons: string[] = ['control-icons ico-stock-type-in', 'control-icons ico-stock-type-out'];

	public getIconType() {
		return LookupImageIconType.Css;
	}

	public select(item: IBasicsCustomizePrcStockTransactionTypeEntity, context: ILookupContext<IBasicsCustomizePrcStockTransactionTypeEntity, TEntity>): string {
		return item.Icon === 1 ? 'control-icons ico-stock-type-in' : 'control-icons ico-stock-type-out';
	}
}
