/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPaymentScheduleBehaviorService } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcPaymentScheduleEntity } from '../model/entities';
import { ProcurementCommonPaymentScheduleDataService } from '../services';
import { Injectable } from '@angular/core';

/**
 * Procurement common payment schedule behavior service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonPaymentScheduleBehaviorService<
   T extends IPrcPaymentScheduleEntity,
   PT extends IEntityIdentification,
   PU extends CompleteIdentification<PT>,
	RT extends IEntityIdentification = PT,
	RU extends CompleteIdentification<RT> = PU>
   extends BasicsSharedPaymentScheduleBehaviorService<T, PT, PU> {
	/**
	 * The constructor
	 * @param dataService
	 * @protected
	 */
	protected constructor(dataService: ProcurementCommonPaymentScheduleDataService<T, PT, PU, RT, RU>) {
		super(dataService);
	}
}