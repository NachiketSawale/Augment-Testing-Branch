/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConstructionSystemMasterLineItemDataService } from '../services/construction-system-master-line-item-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterLineItemBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstLineItemEntity>, IEstLineItemEntity> {
	private readonly dataService = inject(ConstructionSystemMasterLineItemDataService);

	public onCreate(containerLink: IGridContainerLink<IEstLineItemEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'refresh',
				sort: 10,
				caption: { key: 'constructionsystem.master.taskBarUpdate' },
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-refresh',
				hideItem: false,
				disabled: false,
				fn: async () => {
					await this.dataService.refreshData();
				},
			},
		]);
	}
}
