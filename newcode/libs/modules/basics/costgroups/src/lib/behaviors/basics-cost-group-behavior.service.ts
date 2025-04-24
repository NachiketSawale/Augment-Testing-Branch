/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ICostGroupEntity} from '../model/entities/cost-group-entity.interface';
import {ItemType} from '@libs/ui/common';
import {BasicsCostGroupDataService} from '../services/basics-cost-group-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsCostGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<ICostGroupEntity>, ICostGroupEntity> {
	private dataService: BasicsCostGroupDataService;

	public constructor() {
		this.dataService = inject(BasicsCostGroupDataService);
	}
	
	public onCreate(containerLink: IGridContainerLink<ICostGroupEntity>): void {

		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				caption: { key : 'cloud.common.taskBarDeepCopyRecord' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 'createDeepCopy',
				fn: () => {
					this.dataService.createDeepCopy();
				},
				disabled: () => {
					return this.dataService.getSelection().length > 0;
				},
				sort: 4,
				type: ItemType.Item
			}
		], EntityContainerCommand.Settings);
	}

}