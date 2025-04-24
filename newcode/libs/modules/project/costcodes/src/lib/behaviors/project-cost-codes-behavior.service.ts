/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { ProjectCostCodesDataService } from '../services/project-cost-codes-data.service';

export const PROJECT_COST_CODES_BEHAVIOR_TOKEN = new InjectionToken<ProjectCostCodesBehavior>('projectCostCodesBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProjectCostCodesBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrjCostCodesEntity>, IPrjCostCodesEntity> {
	private dataService: ProjectCostCodesDataService;
	public constructor() {
		this.dataService = inject(ProjectCostCodesDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPrjCostCodesEntity>): void {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<IPrjCostCodesEntity>) {
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				caption: { key: 'cloud.common.toolbarInsertSub' },
				iconClass: 'tlb-icons ico-sub-fld-new',
				type: ItemType.Item,
				sort: 1,
				disabled: () => {
					return !this.dataService.canCreateChild();
				},
				fn: () => {
					this.dataService.createChild();
				},
			},
		];

		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
		containerLink.uiAddOns.toolbar.deleteItems('delete');
	}
}
