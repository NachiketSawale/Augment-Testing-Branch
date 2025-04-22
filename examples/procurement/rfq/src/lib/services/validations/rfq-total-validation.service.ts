/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonTotalValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { IPrcCommonTotalEntity, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../../model/entities/rfq-header-entity-complete.class';
import { ProcurementRfqTotalDataService } from '../rfq-total-data.service';

/**
 * Requisition total validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRFQTotalValidationService extends ProcurementCommonTotalValidationService<IPrcCommonTotalEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {

	public constructor() {
		const dataService = inject(ProcurementRfqTotalDataService);

		super(dataService);
	}

}