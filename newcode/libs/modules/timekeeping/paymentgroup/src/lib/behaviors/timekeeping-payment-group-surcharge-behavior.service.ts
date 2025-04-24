/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { TimekeepingPaymentGroupSurchargeDataService } from '../services/timekeeping-payment-group-surcharge-data.service';
import { IPaymentGroupSurEntity } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_PAYMENT_GROUP_SURCHARGE_BEHAVIOR_TOKEN = new InjectionToken<TimekeepingPaymentGroupSurchargeBehavior>('TimekeepingPaymentGroupSurchargeBehavior');

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPaymentGroupSurchargeBehavior implements IEntityContainerBehavior<IGridContainerLink<IPaymentGroupSurEntity>, IPaymentGroupSurEntity> {

	private dataService: TimekeepingPaymentGroupSurchargeDataService;


	public constructor() {
		this.dataService = inject(TimekeepingPaymentGroupSurchargeDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPaymentGroupSurEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);
	}

}
