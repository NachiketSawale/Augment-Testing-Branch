/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { SalesContractPaymentScheduleDataService } from '../services/sales-contract-payment-schedule-data.service';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN = new InjectionToken<SalesContractPaymentScheduleBehavior>('SalesContractPaymentScheduleBehavior');

@Injectable({
	providedIn: 'root'
})
export class SalesContractPaymentScheduleBehavior implements IEntityContainerBehavior<IGridContainerLink<IOrdPaymentScheduleEntity>, IOrdPaymentScheduleEntity> {

	public constructor(private dataService: SalesContractPaymentScheduleDataService) {}

	public onCreate(containerLink: IGridContainerLink<IOrdPaymentScheduleEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'config_total_calculatorTools',
				sort: 200,
				hideItem: false,
				type: ItemType.Sublist,
				list: {
					items: [
						{
							id: 'estimate-main-config-total-recalculate',
							hideItem: false,
							type: ItemType.Item,
							caption: 'estimate.main.dirtyRecalculate',
							iconClass: 'control-icons ico-recalculate',
							fn: () => {
								this.dataService.updateCalculation();
							},
							disabled: () => {
								return this.dataService.getSelectedEntity() === null;
								},
						}]
					}
			}]
		);
	}
}