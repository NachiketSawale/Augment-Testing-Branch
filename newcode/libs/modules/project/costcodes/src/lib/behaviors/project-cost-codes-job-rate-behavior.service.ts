/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IProjectCostCodesJobRateEntity } from '@libs/project/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
export const PROJECT_COST_CODES_BEHAVIOR_TOKEN = new InjectionToken<ProjectCostCodesJobRateBehavior>('projectCostCodesBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProjectCostCodesJobRateBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectCostCodesJobRateEntity>, IProjectCostCodesJobRateEntity> {

	public onCreate(containerLink: IGridContainerLink<IProjectCostCodesJobRateEntity>): void {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<IProjectCostCodesJobRateEntity>) {
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				caption: { key: 'cloud.common.jobFilter' },
				iconClass: 'tlb-icons ico-filter-based-job',
				type: ItemType.DropdownBtn,
                list:{
                    showImages:false,
                    cssClass: 'dropdown-menu-right',
                    items: []
                }
				//fn: () => TODO: jobFilter click functionality
			},
            {
				caption: { key: 'cloud.common.versionFilter' },
				iconClass: 'tlb-icons ico-filter-based-estimate',
				type: ItemType.DropdownBtn,
                list:{
                    showImages:false,
                    cssClass: 'dropdown-menu-right',
                    items: []
                }
				//fn: () => TODO: toolbarInsertSub click functionality
			},
		];

		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
	}
}
