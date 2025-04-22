/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonEventsEntity, ProcurementCommonEventsDataService } from '@libs/procurement/common';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';

/**
 * events service in quote
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteEventsDataService extends ProcurementCommonEventsDataService<IProcurementCommonEventsEntity,IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor() {
		const parentService = inject(ProcurementQuoteHeaderDataService);
		super(parentService);
	}

	protected override getPackageFk(parent: IQuoteHeaderEntity): number {
		if(parent) {
			return parent.PackageFk!;
		}
		throw new Error('Should have selected parent entity');
	}

	protected override isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IProcurementCommonEventsEntity): boolean {
		return entity.PrcPackageFk === parentKey.PackageFk;
	}
}