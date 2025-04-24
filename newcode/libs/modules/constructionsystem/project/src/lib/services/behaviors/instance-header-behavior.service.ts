/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { constructionSystemProjectInstanceHeaderService } from '../instance-header.service';

@Injectable({
	providedIn: 'root',
})
export class constructionSystemProjectInstanceHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IInstanceHeaderEntity>, IInstanceHeaderEntity> {
	private readonly instanceHeaderService = inject(constructionSystemProjectInstanceHeaderService);

	public onCreate(containerLink: IGridContainerLink<IInstanceHeaderEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					id: 't1001',
					caption: { text: 'Create', key: 'constructionsystem.project.deepRemoveRecord' },
					sort: 1,
					hideItem: false,
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-delete',
					fn: () => {
						this.instanceHeaderService.deepDelete();
					},
					disabled: () => {
						return !this.instanceHeaderService.hasSelection();
					},
				},
				{
					caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
					hideItem: false,
					iconClass: 'tlb-icons ico-copy-paste-deep',
					id: 'createDeepCopy',
					fn: () => {
						this.instanceHeaderService.createDeepCopy();
					},
					disabled: () => {
						return !this.instanceHeaderService.hasSelection();
					},
					sort: 3,
					type: ItemType.Item,
				},
			],
			EntityContainerCommand.Settings,
		);
	}
}
