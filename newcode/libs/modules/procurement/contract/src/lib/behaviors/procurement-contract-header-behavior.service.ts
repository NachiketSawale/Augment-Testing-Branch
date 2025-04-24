/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import {IConHeaderEntity} from '../model/entities';
import {ProcurementContractHeaderDataService} from '../services/procurement-contract-header-data.service';
import { ProcurementContractBaselineDataService } from '../services/procurement-contract-baseline-data.service';
import { isEmpty } from 'lodash';
import { ItemType } from '@libs/ui/common';
export const PROCUREMENT_CONTRACT_HEADER_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractHeaderBehavior>('procurementContractHeaderBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IConHeaderEntity>, IConHeaderEntity> {
	private readonly dataService = inject(ProcurementContractHeaderDataService);
	private  readonly conBaselineService  = inject(ProcurementContractBaselineDataService);


	public onCreate(containerLink: IGridContainerLink<IConHeaderEntity>): void {
		// todo - add pin project buttons: https://rib-40.atlassian.net/browse/DEV-31761, for framework team
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.deepCopy' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 't12',
				sort: 1001,
				disabled: () => {
					return isEmpty(this.dataService.getSelection());
				},
				fn: () => {
					this.dataService.createDeepCopy();
				},
				type: ItemType.Item
			},
		]);
	}

	public onDestroy(containerLink: IGridContainerLink<IConHeaderEntity>): void {
		this.conBaselineService.clearIsShowMessageboxCache();
	}
}
