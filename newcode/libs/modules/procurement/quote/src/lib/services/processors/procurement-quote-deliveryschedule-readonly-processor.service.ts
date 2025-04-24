/*
 * Copyright(c) RIB Software GmbH
 */
import { IProcurementCommonDeliveryScheduleEntity,ProcurementCommonDeliveryScheduleProcessor } from '@libs/procurement/common';
import { ProcurementQuoteDeliveryScheduleDataService } from '../procurement-quote-deliveryschedule-data.service';
import { IQuoteItemEntity } from '../../model/entities/quote-item-entity.interface';
import { QuoteItemComplete } from '../../model/entities/quote-item-entity-complete.class';

export class ProcurementQuoteDeliveryScheduleProcessor extends ProcurementCommonDeliveryScheduleProcessor<IProcurementCommonDeliveryScheduleEntity,IQuoteItemEntity, QuoteItemComplete> {

	public constructor(protected deliveryscheduleDataService:ProcurementQuoteDeliveryScheduleDataService){
		super(deliveryscheduleDataService);
	}

	public isReadonly(): boolean {
		return false;
	}
}