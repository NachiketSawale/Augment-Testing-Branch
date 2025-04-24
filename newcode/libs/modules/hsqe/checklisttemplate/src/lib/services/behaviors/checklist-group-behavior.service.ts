/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { IHsqCheckListGroupEntity } from '@libs/hsqe/interfaces';
import { CheckListGroupDataService } from '../checklist-group-data.service';

@Injectable({
	providedIn: 'root',
})
export class CheckListGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IHsqCheckListGroupEntity>, IHsqCheckListGroupEntity> {
	private readonly dataService = inject(CheckListGroupDataService);

	public onCreate(containerLink: IGridContainerLink<IHsqCheckListGroupEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					caption: { key: 'cloud.common.toolbarInsertSub' },
					hideItem: false,
					iconClass: ' tlb-icons ico-sub-fld-new',
					id: 'createChild',
					disabled: () => {
						return !this.dataService.canCreateChild();
					},
					fn: () => {
						this.dataService.createChild().then();
					},
					sort: 5,
					type: ItemType.Item,
				},
				{
					id: 't11',
					sort: 110,
					caption: 'cloud.common.toolbarFilter',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-filter-off',
					// TODO toolbarFilter
				},
				{
					id: 't12',
					sort: 120,
					caption: 'cloud.common.toolbarSelectionMode',
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-selection-multi',
					fn: function toogleSelectionMode() {
						//TODO Selection Mode change
					}
				},
			],
			EntityContainerCommand.Settings,
		);
	}
}
