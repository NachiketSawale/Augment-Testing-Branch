/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable} from '@angular/core';
import { IPrcWarrantyEntity, ProcurementCommonWarrantyDataService} from '@libs/procurement/common';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';

/**
 * Warranty  service in quote
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteWarrantyDataService extends ProcurementCommonWarrantyDataService<IPrcWarrantyEntity,IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementQuoteHeaderDataService);
		super(parentService);
	}

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IPrcWarrantyEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}