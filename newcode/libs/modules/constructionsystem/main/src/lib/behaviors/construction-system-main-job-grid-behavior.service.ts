/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICosJobEntity } from '../model/entities/cos-job-entity.interface';
import { ItemType } from '@libs/ui/common';
import { ConstructionSystemMainJobDataService } from '../services/construction-system-main-job-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_JOB_GRID_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMainJobGridBehavior>('constructionSystemMainJobGridBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainJobGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ICosJobEntity>, ICosJobEntity> {
	public constructor(private dataService: ConstructionSystemMainJobDataService) {}

	public onCreate(containerLink: IGridContainerLink<ICosJobEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(EntityContainerCommand.CreateRecord);
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'constructionsystem.main.taskBarDeleteAll' },
				hideItem: false,
				iconClass: 'tlb-icons ico-discard',
				id: 't-delete-all',
				fn: () => {
					this.dataService.deleteAll();
				},
				disabled: () => {
					return this.dataService.canDelete();
				},
				sort: 201,
				type: ItemType.Item,
			},
			{
				id: 't-refresh',
				caption: { key: 'cloud.common.toolbarRefresh' },
				sort: 202,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-refresh',
				fn: () => {
					this.dataService.loadJobs();
				},
			},
		]);
		this.dataService.loadJobs().then((data) => {
			containerLink.gridData = data;
			this.dataService.doQueryStatus();
		});
	}
}
