/*
 * Copyright(c) RIB Software GmbH
 */

import {
	EstimateAssembliesResourceBaseDataService
} from '@libs/estimate/shared';
import { IEstimateCreationData, IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { inject, Injectable } from '@angular/core';
import { ProjectPlantAssemblyMainService } from '../assemblies/project-plant-assembly-main.service';
import { ProjectPlantAssemblyResourceComplete } from '../../model/interfaces/project-plant-assembly-resource-complete.class';
import { ProjectPlantAssemblyEntityComplete } from '../../model/interfaces/project-plant-assembly-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ProjectPlantAssemblyResourceDataService extends EstimateAssembliesResourceBaseDataService<IEstResourceEntity, ProjectPlantAssemblyResourceComplete, IEstLineItemEntity, ProjectPlantAssemblyEntityComplete>{

	private readonly projectMainDataService = inject(ProjectMainDataService);

	/**
	 * Creates an instance of ProjectPlantAssemblyResourceDataService.
	 *
	 * @param projectPlanAssemblyMainService The service for project plant assemblies.
	 */
	public constructor(private projectPlanAssemblyMainService: ProjectPlantAssemblyMainService) {
		super(projectPlanAssemblyMainService, {
			itemName: 'EstResource'
		});
	}

	/**
	 * create payload
	 * @return object
	 * @protected
	 */
	protected override provideCreatePayload(): object{
		const creationData = super.provideCreatePayload() as IEstimateCreationData;
		creationData.projectId = this.getProjectId();
		return creationData;
	}

	/**
	 * Creates or updates a ResourceBaseComplete entity from a given IEstResourceEntity.
	 *
	 * @param modified The modified IEstResourceEntity or null for a new entity.
	 * @returns The created or updated ResourceBaseComplete entity.
	 */
	public override createUpdateEntity(modified: IEstResourceEntity | null): ProjectPlantAssemblyResourceComplete {
		return new ProjectPlantAssemblyResourceComplete(modified);
	}

	/**
	 * equal to updateDone
	 * @param updated
	 */
	public override takeOverUpdated(updated: ProjectPlantAssemblyEntityComplete): void {
		if (updated.PrjPlantAssemblyResourceToSave && updated.PrjPlantAssemblyResourceToSave.length) {
			const resources = updated.PrjPlantAssemblyResourceToSave.filter(e => e.PrjPlantAssemblyResource).map(e => e.PrjPlantAssemblyResource) as IEstResourceEntity[];
			if (resources) {
				this.handleUpdateDone(resources);
			}
		}
		if (updated.PrjPlantAssemblyResourceToDelete && updated.PrjPlantAssemblyResourceToDelete.length) {
			this.remove(updated.PrjPlantAssemblyResourceToDelete);
		}
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: ProjectPlantAssemblyEntityComplete, modified: ProjectPlantAssemblyResourceComplete[], deleted: IEstResourceEntity[]): void {
		if (modified && modified.length) {
			parentUpdate.PrjPlantAssemblyResourceToSave = modified;
		}
		if (deleted && deleted.length) {
			parentUpdate.PrjPlantAssemblyResourceToDelete = deleted;
		}
	}

	/**
	 * can create project plant assembly
	 */
	public override canCreate(): boolean {
		const selectedRes = this.getSelectedEntity();
		if(selectedRes){
			return this.isParentPlantTypeResource(selectedRes);
		}
		return super.canCreate();
	}

	protected createAssemblyResourceRequestObj(assemblyItem: IEstLineItemEntity, assemblyIds: number[], resourceType: number, prjCostCodeIds: number[] | null | undefined): object {
		return {
			MainItemId: assemblyItem.Id,
			ItemIds: assemblyIds,
			ResourceType: resourceType,
			IsPrjPlantAssembly: true,
			LgmJobFk: assemblyItem.LgmJobFk,
			ProjectId: this.getProjectId()
		};
	}

	protected getProjectId(): number | null {
		const projectSelected = this.projectMainDataService.getSelectedEntity();
		return projectSelected ? projectSelected.Id : null;
	}

	protected isInProjectModule(): boolean {
		return true;
	}

	public setReadOnly(){

	}
}