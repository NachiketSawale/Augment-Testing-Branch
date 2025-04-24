/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsProcurementStructureEventDataService } from './basics-procurement-structure-event-data.service';
import { ItemType } from '@libs/ui/common';
import { IPrcStructureEventEntity } from '../model/entities/prc-structure-event-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureEventBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IPrcStructureEventEntity>, IPrcStructureEventEntity> {
	private dataService: BasicsProcurementStructureEventDataService;

	public constructor() {
		this.dataService = inject(BasicsProcurementStructureEventDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPrcStructureEventEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: {key: 'basics.procurementstructure.event.deepCopy'},
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 't1',
				fn: () => {
					this.dataService.deepCopy();
				},
				sort: 1,
				type: ItemType.Item
			},
			{
				id: 'd99',
				type: ItemType.Divider
			}
		]);
	}

}
