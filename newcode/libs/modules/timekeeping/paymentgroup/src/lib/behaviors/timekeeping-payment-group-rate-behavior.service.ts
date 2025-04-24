/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { TimekeepingPaymentGroupRateDataService } from '../services/timekeeping-payment-group-rate-data.service';
import { IPaymentGroupRateEntity } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_PAYMENT_GROUP_RATE_BEHAVIOR_TOKEN = new InjectionToken<TimekeepingPaymentGroupRateBehavior>('TimekeepingPaymentGroupRateBehavior');

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPaymentGroupRateBehavior implements IEntityContainerBehavior<IGridContainerLink<IPaymentGroupRateEntity>, IPaymentGroupRateEntity> {

	private dataService: TimekeepingPaymentGroupRateDataService;


	public constructor() {
		this.dataService = inject(TimekeepingPaymentGroupRateDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPaymentGroupRateEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);
	}


}
