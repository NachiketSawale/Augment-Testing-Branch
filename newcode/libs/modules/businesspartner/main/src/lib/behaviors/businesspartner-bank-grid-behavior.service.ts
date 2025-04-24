/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { InsertPosition, ItemType } from '@libs/ui/common';
import { BusinessPartnerBankDataService } from '../services/businesspartner-bank-data.service';
import { IBusinessPartnerBankEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerBankGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IBusinessPartnerBankEntity>, IBusinessPartnerBankEntity> {
	private dataService = inject(BusinessPartnerBankDataService);

	public onCreate(containerLink: IGridContainerLink<IBusinessPartnerBankEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					id: 't5',
					caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-copy-paste-deep',
					disabled: () => {
						const canCopy = this.dataService.disableDeepCopy();
						return canCopy;
					},
					fn: async () => {
						await this.dataService.copyPaste();
					},
				},
			],
			EntityContainerCommand.Settings,
			InsertPosition.After,
		);
	}
}
