/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { CheckListTemplateHeaderDataService } from '../checklist-template-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class CheckListTemplateBehavior implements IEntityContainerBehavior<IGridContainerLink<IHsqChkListTemplateEntity>, IHsqChkListTemplateEntity> {
	private readonly dataService = inject(CheckListTemplateHeaderDataService);

	public onCreate(containerLink: IGridContainerLink<IHsqChkListTemplateEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					caption: { key: 'cloud.desktop.pinningDesktopDialogHeader' },
					hideItem: false,
					iconClass: 'tlb-icons ico-pin2desktop',
					id: 'pinningTemplate',
					fn: () => {
						//todo: Pin to desktop as a title
						throw new Error('This method is not implemented');
					},
					sort: 120,
					type: ItemType.Item,
				},
				{
					caption: { text: 'Pin Selected Item' },
					hideItem: false,
					iconClass: 'tlb-icons ico-set-prj-context',
					id: 'pinningSelected',
					fn: () => {
						//todo: Pin Selected Item
						throw new Error('This method is not implemented');
					},
					sort: 130,
					type: ItemType.Item,
				},
				{
					caption: { key: 'cloud.common.bulkEditor.title' },
					hideItem: false,
					iconClass: 'type-icons ico-construction51',
					id: 'bulkEditor',
					fn: () => {
						//todo: Bulk Editor
						throw new Error('This method is not implemented');
					},
					sort: 140,
					type: ItemType.Item,
				},
			],
			EntityContainerCommand.Settings,
		);
	}
}
