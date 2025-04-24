/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable } from '@angular/core';
import {
	IProcurementCommonDeliveryScheduleEntity,
	ProcurementCommonDeliveryScheduleDataService
} from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { QuoteItemComplete } from '../model/entities/quote-item-entity-complete.class';
import { IQuoteItemEntity } from '../model/entities/quote-item-entity.interface';
import { ProcurementQuoteItemDataService } from './procurement-quote-item-data.service';
import { ProcurementQuoteDeliveryScheduleProcessor } from './processors/procurement-quote-deliveryschedule-readonly-processor.service';

/**
 * DeliverySchedule service in quote
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteDeliveryScheduleDataService extends ProcurementCommonDeliveryScheduleDataService<IProcurementCommonDeliveryScheduleEntity,IQuoteItemEntity, QuoteItemComplete> {
	public constructor() {
		const parentService = inject(ProcurementQuoteItemDataService);
		super(parentService,ProcurementInternalModule.Contract);
	}

	protected getMainItemId(parent: IQuoteItemEntity): number {
		return parent.Id;
	}

	protected getMainItemStatus(parent: IQuoteItemEntity): number {
		return parent.PrcItemstatusFk;
	}

	protected createReadonlyProcessor(){
		return new ProcurementQuoteDeliveryScheduleProcessor(this);
	}
}