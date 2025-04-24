/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IPrrItemE2cEntity } from '../model/entities/prr-item-e2c-entity.interface';
import { ControllingRevenueRecognitionItemE2cDataService } from './revenue-recognition-e2c-data.service';

@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemE2cBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrrItemE2cEntity>, IPrrItemE2cEntity> {
	private dataService: ControllingRevenueRecognitionItemE2cDataService;

	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	public constructor() {
		this.dataService = inject(ControllingRevenueRecognitionItemE2cDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPrrItemE2cEntity>): void {
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
