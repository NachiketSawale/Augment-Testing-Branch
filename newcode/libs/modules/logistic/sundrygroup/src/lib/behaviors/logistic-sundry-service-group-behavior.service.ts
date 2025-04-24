/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { LogisticSundryServiceGroupDataService } from '../services/logistic-sundry-service-group-data.service';
import { ILogisticSundryServiceGroupEntity } from '@libs/logistic/interfaces';


@Injectable({
	providedIn: 'root',
})
export class LogisticSundryServiceGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<ILogisticSundryServiceGroupEntity>, ILogisticSundryServiceGroupEntity> {
	private dataService: LogisticSundryServiceGroupDataService;

	public constructor() {
		this.dataService = inject(LogisticSundryServiceGroupDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ILogisticSundryServiceGroupEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems('grouping');
	}

}
