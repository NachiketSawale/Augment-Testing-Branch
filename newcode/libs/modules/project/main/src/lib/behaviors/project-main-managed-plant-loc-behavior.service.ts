/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IManagedPlantLocVEntity } from '@libs/project/interfaces';
import { ProjectMainManagedPlantLocDataService } from '../services/project-main-managed-plant-loc-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectMainManagedPlantLocBehavior implements IEntityContainerBehavior<IGridContainerLink<IManagedPlantLocVEntity>, IManagedPlantLocVEntity> {
	private dataService: ProjectMainManagedPlantLocDataService;
	
	public constructor() {
		this.dataService = inject(ProjectMainManagedPlantLocDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IManagedPlantLocVEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}

}