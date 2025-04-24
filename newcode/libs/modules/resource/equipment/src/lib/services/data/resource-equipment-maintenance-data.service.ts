/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentMaintenanceDataGeneratedService } from './generated/resource-equipment-maintenance-data-generated.service';
import { Injectable } from '@angular/core';
import { ResourceEquipmentPlantComponentUpdate } from '../../model/resource-equipment-plant-component-update.class';
import { IResourceEquipmentMaintenanceEntity } from '@libs/resource/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import { IDataServiceOptions } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentMaintenanceDataService extends ResourceEquipmentMaintenanceDataGeneratedService {
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: ResourceEquipmentPlantComponentUpdate, modified: IResourceEquipmentMaintenanceEntity[], deleted: IResourceEquipmentMaintenanceEntity[]) {
		if (modified && modified.length > 0) {
			complete.MaintenanceToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.MaintenanceToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ResourceEquipmentPlantComponentUpdate): IResourceEquipmentMaintenanceEntity[] {
		if (complete && complete.MaintenanceToSave) {
			return complete.MaintenanceToSave;
		}

		return [];
	}

	protected override prepareCreateParameter(parentInfo: IIdentificationData, serviceOptions: IDataServiceOptions<IResourceEquipmentMaintenanceEntity>): IIdentificationData {

		if (this.typedParent) {
			const selection = this.typedParent.getSelectedEntity();
			if (selection !== null) {
				return {
					id: 0,
					pKey1: selection.Id,
					pKey2: selection.PlantFk,
					pKey3: undefined
				};
			}
		}

		return parentInfo;
	}
}