/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {
	IEstResourceEntity
} from '@libs/estimate/interfaces';
import { LineItemBaseComplete } from '@libs/estimate/shared';
import { ResourceBaseComplete } from '@libs/estimate/shared';
import { EstimateAssembliesResourceBaseDataService } from '@libs/estimate/shared';
import { Injectable } from '@angular/core';
import { EstimateAssembliesService } from '../assemblies/estimate-assemblies-data.service';

/**
 * A service responsible for handling resource data related to estimate assemblies.
 * Extends the AssemblyResourceBaseDataService with specific functionality for resource entities.
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateAssembliesResourceDataService extends EstimateAssembliesResourceBaseDataService<IEstResourceEntity, ResourceBaseComplete, IEstLineItemEntity, LineItemBaseComplete>{

	/**
	 * Creates an instance of EstimateAssembliesResourceDataService.
	 *
	 * @param estimateAssembliesService The service for estimate assemblies.
	 */
	public constructor(private estimateAssembliesService: EstimateAssembliesService) {
		super(estimateAssembliesService, {
			itemName: 'EstResource'
		});
	}

	/**
	 * Creates or updates a ResourceBaseComplete entity from a given IEstResourceEntity.
	 *
	 * @param modified The modified IEstResourceEntity or null for a new entity.
	 * @returns The created or updated ResourceBaseComplete entity.
	 */
	public override createUpdateEntity(modified: IEstResourceEntity | null): ResourceBaseComplete {
		return new ResourceBaseComplete(modified);
	}

	/**
	 * equal to updateDone
	 * @param updated
	 */
	public override takeOverUpdated(updated: LineItemBaseComplete): void {
		if (updated.EstResourceToSave && updated.EstResourceToSave.length) {
			const resources = updated.EstResourceToSave.filter(e => e.EstResource).map(e => e.EstResource) as IEstResourceEntity[];
			if (resources) {
				this.handleUpdateDone(resources);
			}
		}
		if (updated.EstResourceToDelete && updated.EstResourceToDelete.length) {
			this.remove(updated.EstResourceToDelete);
		}
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: LineItemBaseComplete, modified: ResourceBaseComplete[], deleted: IEstResourceEntity[]): void {
		if (modified && modified.length) {
			parentUpdate.EstResourceToSave = modified;
		}
		if (deleted && deleted.length) {
			parentUpdate.EstResourceToDelete = deleted;
		}
	}

	public override getProjectId(){
		return null;
	}

	public override isInProjectModule(){
		return false;
	}

	protected override createAssemblyResourceRequestObj(assemblyItem: IEstLineItemEntity, assemblyIds: number[], resourceType: number, prjCostCodeIds: number[]): object {
		return {
			MainItemId: assemblyItem.Id,
			ItemIds: assemblyIds,
			ResourceType: resourceType
		};
	}
}