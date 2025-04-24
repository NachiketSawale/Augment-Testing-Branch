/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { EstimateMainStandardAllowancesCostCodeDetailDataService } from './estimate-main-standard-allowances-cost-code-detail-data.service';
import {ItemType} from '@libs/ui/common';
import { IEstAllMarkup2costcodeEntity } from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainStandardAllowancesCostCodeDetailBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstAllMarkup2costcodeEntity>, IEstAllMarkup2costcodeEntity> {

	private dataService: EstimateMainStandardAllowancesCostCodeDetailDataService;
	private subscriptions: Subscription[] = [];


	public constructor() {
		this.dataService = inject(EstimateMainStandardAllowancesCostCodeDetailDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IEstAllMarkup2costcodeEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		this.subscriptions.push(dataSub);
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IEstAllMarkup2costcodeEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'estimate.main.markupUpdateMajorCostCode' },
				hideItem: false,
				iconClass: 'tlb-icons ico-rec-new-deepcopy',
				id: 'update',
				sort: -1,
				// disabled: () => {
				// 	let selectedAllowance = inject(EstimateMainStandardAllowancesDataService).getSelectedEntity();
				// 	return  this.dataService.setUpdateMajorCostCodeButtonIsDisabled(selectedAllowance);
				// },
				fn: () => {
					this.dataService.updateMajorCostCode();
				},
				type: ItemType.Item
			},
		]);
	}

	public onDestroy(containerLink: IGridContainerLink<IEstAllMarkup2costcodeEntity>): void {
		this.subscriptions.forEach(sub => {
			sub.unsubscribe();
		});
	}
}