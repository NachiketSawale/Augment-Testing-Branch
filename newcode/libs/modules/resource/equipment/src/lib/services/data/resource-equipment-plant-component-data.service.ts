/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentPlantComponentDataGeneratedService } from './generated/resource-equipment-plant-component-data-generated.service';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantComponentEntity } from '@libs/resource/interfaces';
import { ResourceEquipmentPlantComponentUpdate } from '../../model/resource-equipment-plant-component-update.class';
import { ResourceEquipmentPlantUpdate } from '../../model/resource-equipment-plant-update.class';
import { IEntityList } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantComponentDataService extends ResourceEquipmentPlantComponentDataGeneratedService {
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: ResourceEquipmentPlantUpdate, modified: ResourceEquipmentPlantComponentUpdate[], deleted: IResourceEquipmentPlantComponentEntity[]) {
		if (modified && modified.length > 0) {
			complete.PlantComponentToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.PlantComponentToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: ResourceEquipmentPlantUpdate): IResourceEquipmentPlantComponentEntity[]{
		if(parentUpdate.PlantComponentToSave !== null && parentUpdate.PlantComponentToSave !== undefined){
			const plantComponents = [] as IResourceEquipmentPlantComponentEntity[];
			parentUpdate.PlantComponentToSave.forEach( updated=> {
				if(updated.PlantComponent !== null){
					plantComponents.push(updated.PlantComponent);
				}
			});
			return plantComponents;
		}
		return [];
	}

	private takeOverUpdatedFromComplete(complete: ResourceEquipmentPlantUpdate, entityList: IEntityList<IResourceEquipmentPlantComponentEntity>) {
		if (complete && complete.PlantComponentToSave && complete.PlantComponentToSave.length > 0) {
			const pC: IResourceEquipmentPlantComponentEntity[] = [];
			complete.PlantComponentToSave.forEach((pCC) => {
				if (pCC.PlantComponent != null) {
					pC.push(pCC.PlantComponent);
				}
			});
			entityList.updateEntities(pC);
		}
	}
}