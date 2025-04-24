/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { isEmpty } from 'lodash';
import { ItemType } from '@libs/ui/common';
import { HsqeChecklistDataService } from '../services/hsqe-checklist-data.service';

export const HSQE_CHECKLIST_BEHAVIOR_TOKEN = new InjectionToken<HsqeChecklistBehavior>('hsqeChecklistBehavior');

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistBehavior implements IEntityContainerBehavior<IGridContainerLink<IHsqCheckListEntity>, IHsqCheckListEntity> {
	private readonly dataService: HsqeChecklistDataService = inject(HsqeChecklistDataService);

	public onCreate(containerLink: IGridContainerLink<IHsqCheckListEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
					hideItem: false,
					iconClass: 'tlb-icons ico-copy-paste-deep',
					id: 'createDeepCopy',
					fn: () => {
						this.dataService.createDeepCopy();
					},
					disabled: () => {
						return isEmpty(this.dataService.getSelection());
					},
					sort: 4,
					type: ItemType.Item,
				},
				{
					caption: { key: 'hsqe.checklist.header.deepCopyToSubTip' },
					hideItem: false,
					iconClass: 'tlb-icons ico-sub-fld-new',
					id: 'createSubChild',
					fn: () => {
						this.dataService.createSubDeepCopy();
					},
					disabled: () => {
						return !this.dataService.canCopy();
					},
					sort: 5,
					type: ItemType.Item,
				},
			],
			EntityContainerCommand.Settings,
		);
	}
}
