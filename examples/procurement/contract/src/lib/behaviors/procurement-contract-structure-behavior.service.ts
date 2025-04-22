/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';

export const PROCUREMENT_CONTRACT_STRUCTURE_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractStructureBehavior>('procurementContractStructureBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractStructureBehavior implements IEntityContainerBehavior<IGridContainerLink<IConHeaderEntity>, IConHeaderEntity> {
	private readonly dataService = inject(ProcurementContractHeaderDataService);

	public onCreate(containerLink: IGridContainerLink<IConHeaderEntity>): void {

		// todo - custom toolbar buttons

		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'dContractSub',
				type: ItemType.Divider
			},
			{
				caption: { key: 'procurement.contract.createOrderChange' },
				hideItem: false,
				iconClass: 'tlb-icons ico-new-change-order',
				id: 'contractOrderChange',
				disabled: this.dataService.isFrameworkContract(),
				fn: async () => {
					await this.dataService.createChangeOrder();
				},
				type: ItemType.Item
			},
			{
				caption: { key: 'procurement.contract.createCallOff' },
				hideItem: false,
				iconClass: 'tlb-icons ico-new-call-off',
				id: 'contractCallOff',
				disabled: this.dataService.isFrameworkContract(),
				fn: async () => {
					await this.dataService.createCallOff();
				},
				type: ItemType.Item
			}
		]);
	}
}
