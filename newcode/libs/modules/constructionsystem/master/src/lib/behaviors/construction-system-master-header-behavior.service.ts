/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '@libs/ui/common';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConstructionSystemMasterHeaderDataService } from '../services/construction-system-master-header-data.service';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_HEADER_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMasterHeaderBehavior>('constructionSystemMasterHeaderBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<ICosHeaderEntity>, ICosHeaderEntity> {
	private dataService = inject(ConstructionSystemMasterHeaderDataService);

	public onCreate(containerLink: IGridContainerLink<ICosHeaderEntity>) {
		//todo-allen: Wait for the framework to finish these four buttons: createDeepCopy, watchlist, pin2desktop, bulkEditor.
		// Replace the 'fn' parameter of the createDeepCopy button with 'dataService.createDeepCopy'.
		containerLink.uiAddOns.toolbar.addItems(
			[
				{
					caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
					hideItem: false,
					iconClass: 'tlb-icons ico-copy-paste-deep',
					id: 'createDeepCopy',
					sort: 4,
					type: ItemType.Item,
					fn: async () => {
						await this.dataService.createDeepCopy();
					},
					disabled: () => {
						return !this.dataService.hasSelection();
					},
				},
			],
			EntityContainerCommand.CreationGroup,
		);
	}
}
