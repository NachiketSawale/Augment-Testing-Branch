/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { ProjectPlantAssemblyMainService } from './project-plant-assembly-main.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

/**
 * Service to handle behaviors related to estimate assemblies
 */
@Injectable({
	providedIn: 'root'
})
export class ProjectPlantAssemblyBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstLineItemEntity>, IEstLineItemEntity> {

	/**
	 * EstimateAssembliesBehaviorService constructor
	 * @param dataService EstimateAssembliesService
	 */
	public constructor(private dataService: ProjectPlantAssemblyMainService) {}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IEstLineItemEntity>): void {
	}
}