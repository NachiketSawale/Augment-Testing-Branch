/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { TimekeepingPaymentGroupDataService } from '../services/timekeeping-payment-group-data.service';
import { ISearchPayload } from '@libs/platform/common';
import { IPaymentGroupEntity } from '@libs/timekeeping/interfaces';

export const TIMEKEEPING_PAYMENT_GROUP_BEHAVIOR_TOKEN = new InjectionToken<TimekeepingPaymentGroupBehavior>('TimekeepingPaymentGroupBehavior');

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPaymentGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IPaymentGroupEntity>, IPaymentGroupEntity> {

	private dataService: TimekeepingPaymentGroupDataService;


	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: 'MAX',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true
	};

	public constructor() {
		this.dataService = inject(TimekeepingPaymentGroupDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPaymentGroupEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);

		this.dataService.refresh(this.searchPayload).then(data => containerLink.gridData = data.dtos);

	}

}
