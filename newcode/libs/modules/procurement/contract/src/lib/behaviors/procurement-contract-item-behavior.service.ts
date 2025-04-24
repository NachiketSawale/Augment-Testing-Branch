/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IGridContainerLink } from '@libs/ui/business-base';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { IPrcItemEntity, ProcurementCommonItemBehavior } from '@libs/procurement/common';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { ConItemComplete } from '../model/con-item-complete.class';

export const PROCUREMENT_CONTRACT_ITEM_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractItemBehavior>('procurementContractItemBehavior');

/**
 * Procurement contract item behavior
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractItemBehavior extends ProcurementCommonItemBehavior<IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor(private conItemDataService: ProcurementContractItemDataService) {
		super(conItemDataService);
	}

	public override onCreate(containerLink: IGridContainerLink<IPrcItemEntity>) {
		super.onCreate(containerLink);

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'procurement.common.copyMainContractItems' },
				disabled: () => {
					return !this.conItemDataService.canCopyCallOffItems;
				},
				iconClass: 'control-icons ico-copy-action1-2',
				id: 'copyMainCallOffItems',
				fn: () => {
					this.conItemDataService.copyCallOffItems();
				},
				sort: 1,
				type: ItemType.Item,
			},
		]);

		// initialize
		this.conItemDataService.checkCanCopyCallOffItems();

		const contractChangedSub = this.conItemDataService.contractDataService.selectionChanged$.subscribe(async () => {
			await this.conItemDataService.checkCanCopyCallOffItems();
		});

		containerLink.registerSubscription(contractChangedSub);
	}
}
