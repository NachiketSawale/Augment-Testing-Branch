/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ProcurementRfqTotalDataService } from '../services/rfq-total-data.service';
import { ProcurementCommonTotalBehavior } from '@libs/procurement/common';
import { IPrcCommonTotalEntity, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';

export const PROCUREMENT_RFQ_TOTAL_BEHAVIOR_TOKEN = new InjectionToken<ProcurementRfqTotalBehavior>('ProcurementRfqTotalBehavior');

@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqTotalBehavior extends ProcurementCommonTotalBehavior<IPrcCommonTotalEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	public constructor() {
		super(inject(ProcurementRfqTotalDataService));
	}
}