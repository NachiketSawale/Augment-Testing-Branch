/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ItemType } from '@libs/ui/common';
import { ILogisticSundryServiceEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServiceDataService } from '@libs/logistic/sundryservice';


@Injectable({
	providedIn: 'root',
})
export class LogisticSundryServiceGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ILogisticSundryServiceEntity>, ILogisticSundryServiceEntity> {
	private dataService: LogisticSundryServiceDataService;
	
	public constructor() {
		this.dataService = inject(LogisticSundryServiceDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ILogisticSundryServiceEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 'createDeepCopy',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 4,
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.desktop.pinningDesktopDialogHeader' },
				hideItem: false,
				iconClass: 'tlb-icons ico-pin2desktop',
				id: 't-addpinningdocument',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 119,
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.bulkEditor.title' },
				hideItem: false,
				iconClass: 'type-icons ico-construction51',
				id: 'bulkEditor',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 130,
				type: ItemType.Item,
			},
		]);

	}

}
