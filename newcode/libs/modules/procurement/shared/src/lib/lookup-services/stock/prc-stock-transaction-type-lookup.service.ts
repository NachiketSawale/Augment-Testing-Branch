/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPrcStockTransactionTypeEntity } from '../../model/entities';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PrcStockTransactionTypeLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPrcStockTransactionTypeEntity, TEntity> {
	public constructor() {
		super('PrcStocktransactiontype', {
			uuid: 'd2b7dca0dbdabc4027d7425d3673c394',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showClearButton: true,
		});
	}

	public async getDefault() {
		const list = await firstValueFrom(this.getList());
		let defaultItem = list.find((e) => e.IsDefault);

		if (!defaultItem && list.length > 0) {
			defaultItem = list[0];
		}

		return defaultItem;
	}
}
