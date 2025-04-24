/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistDataService } from '../services/hsqe-checklist-data.service';
import { isEmpty } from 'lodash';

export const HSQE_CHECKLIST_STRUCTURE_BEHAVIOR_TOKEN = new InjectionToken<HsqeChecklistStructureBehavior>('hsqeChecklistStructureBehavior');

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistStructureBehavior implements IEntityContainerBehavior<IGridContainerLink<IHsqCheckListEntity>, IHsqCheckListEntity> {
	private readonly dataService = inject(HsqeChecklistDataService);

	public onCreate(containerLink: IGridContainerLink<IHsqCheckListEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems('createChild');
		containerLink.uiAddOns.toolbar.addItems(
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
			EntityContainerCommand.CreationGroup,
		);
	}
}
