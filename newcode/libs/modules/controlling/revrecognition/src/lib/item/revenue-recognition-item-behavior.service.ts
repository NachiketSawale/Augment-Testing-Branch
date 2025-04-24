/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ControllingRevenueRecognitionItemDataService } from './revenue-recognition-item-data.service';
import { IPrrItemEntity } from '../model/entities/prr-item-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrrItemEntity>, IPrrItemEntity> {
	private dataService: ControllingRevenueRecognitionItemDataService;

	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	public constructor() {
		this.dataService = inject(ControllingRevenueRecognitionItemDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPrrItemEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: {key: 'controlling.revrecognition.recalculate'},
				hideItem: false,
				iconClass: 'control-icons ico-recalculate',
				id: 't100',
				disabled: () => {
					return false;
				},
				fn: async () => {
					const result = await this.messageBoxService.showYesNoDialog({
						headerText: 'controlling.revrecognition.recalculateCaption',
						bodyText: 'controlling.revrecognition.recalculateTipMessage2',
					});
					if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
						this.dataService.refreshItem();
					}
				},
				type: ItemType.Item,
			},
		]);
	}

}
