/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IRfqSendHistoryEntity } from '../model/entities/rfq-send-history-entity.interface';
import { ProcurementRfqSendHistoryDataService } from '../services/rfq-send-history-data.service';
import { ItemType } from '@libs/ui/common';

/**
 * Rfq send history behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqSendHistoryBehavior implements IEntityContainerBehavior<IGridContainerLink<IRfqSendHistoryEntity>, IRfqSendHistoryEntity> {
	private readonly dataService = inject(ProcurementRfqSendHistoryDataService);

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<IRfqSendHistoryEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'download',
				caption: {
					text: 'Download',
					key: 'basics.common.upload.button.downloadCaption'
				},
				type: ItemType.Item,
				hideItem: false,
				sort: 1,
				cssClass: 'tlb-icons ico-download',
				fn: () => {
					this.dataService.downloadFiles();
				},
				disabled: () => {
					return !this.dataService.hasSelection();
				}
			}, {
				id: 'JumpLink',
				caption: 'procurement.rfq.JumpLink',
				type: ItemType.Item,
				hideItem: false,
				sort: 2,
				iconClass: 'tlb-icons ico-goto',
				fn: () => {
					const item = this.dataService.getSelection()[0];
					if (item?.EmailLink) {
						this.openEmailLink(item);
					}
				},
				disabled: () => {
					return !this.dataService.hasSelection();
				}
			}
		]);
	}

	private openEmailLink  (item: IRfqSendHistoryEntity) {
		window.open(item['EmailLink'], '_blank');
	}
}