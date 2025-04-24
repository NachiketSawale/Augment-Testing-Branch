/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { EstimateMainStandardAllowancesDataService } from './estimate-main-standard-allowances-data.service';
import {
	EstimateMainStandardAllowancesCostCodeDetailDataService
} from '../allowance-markup/estimate-main-standard-allowances-cost-code-detail-data.service';
import { IEstAllowanceEntity } from '@libs/estimate/interfaces';

// todo Will be completed in the future
@Injectable({
	providedIn: 'root'
})
export class EstimateMainStandardAllowancesBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstAllowanceEntity>, IEstAllowanceEntity> {

	private dataService: EstimateMainStandardAllowancesDataService;
	private estimateMainStandardAllowancesCostCodeDetailDataService: EstimateMainStandardAllowancesCostCodeDetailDataService;
	
	public constructor() {
		this.dataService = inject(EstimateMainStandardAllowancesDataService);
		this.estimateMainStandardAllowancesCostCodeDetailDataService = inject(EstimateMainStandardAllowancesCostCodeDetailDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IEstAllowanceEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);

		const allowanceSelectChangeSub = this.dataService.selectionChanged$.subscribe(() => {
			const selectedItem = this.dataService.getSelectedEntity();
			if(selectedItem && selectedItem.MdcAllowanceTypeFk < 3){
				this.estimateMainStandardAllowancesCostCodeDetailDataService.load({id: selectedItem.Id});
			}
		});
		containerLink.registerSubscription(allowanceSelectChangeSub);

		this.dataService.refreshAll();
	}
}