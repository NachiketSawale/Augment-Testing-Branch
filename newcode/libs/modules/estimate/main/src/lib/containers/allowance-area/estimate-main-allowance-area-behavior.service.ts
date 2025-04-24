/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { EstimateMainAllowanceAreaDataService } from './estimate-main-allowance-area-data.service';
import {IEstAllowanceAreaEntity} from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainAllowanceAreaBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstAllowanceAreaEntity>, IEstAllowanceAreaEntity> {

	private dataService: EstimateMainAllowanceAreaDataService;

	public constructor() {
		this.dataService = inject(EstimateMainAllowanceAreaDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IEstAllowanceAreaEntity>): void {
		 this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		// todo wait estimateMainAllowanceAreaValueColumnGenerator
		// setTimeout(() => {
		// 	$injector.get('estimateMainAllowanceAreaValueColumnGenerator').refreshColumns();
		// });

	}
}