/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IProjectGroupEntity } from '@libs/project/interfaces';
import { ProjectGroupDataService } from '../services/project-group-data.service';

import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ProjectGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IProjectGroupEntity>, IProjectGroupEntity> {
	private dataService: ProjectGroupDataService;
	

	public constructor() {
		this.dataService = inject(ProjectGroupDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IProjectGroupEntity>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.toolbarInsertSub' },
				hideItem: false,
				iconClass: ' tlb-icons ico-sub-fld-new',
				id: 'createChild',
				disabled: () => {
					return !this.dataService.canCreateChild();
				},
				fn: () => {
					this.dataService.createChild().then();
				},
				sort: 5,
				type: ItemType.Item,
			},
			{
				caption: { key: 'project.group.createAutoIntegratedGroup' },
				hideItem: false,
				iconClass: 'tlb-icons ico-add-extend',
				id: 'createAutoIntegrated',
				fn: () => {
					this.dataService.createAutoIntegratedRoot();
				},
				disabled: () => {
					return this.dataService.isCreateAutoGenerationDisabled();
				},
				sort: 300,
				type: ItemType.Item,
			},
		]);
		containerLink.uiAddOns.toolbar.deleteItems('grouping');
	}

}