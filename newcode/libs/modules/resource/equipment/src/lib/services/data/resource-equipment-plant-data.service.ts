/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentPlantDataGeneratedService } from './generated/resource-equipment-plant-data-generated.service';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantEntity } from '@libs/resource/interfaces';
import { ResourceEquipmentPlantUpdate } from '../../model/resource-equipment-plant-update.class';
import { IDataServiceOptions, IEntityList, IEntityProcessor } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantDataService extends ResourceEquipmentPlantDataGeneratedService {
	public override createUpdateEntity(modified: IResourceEquipmentPlantEntity | null): ResourceEquipmentPlantUpdate {
		const complete = new ResourceEquipmentPlantUpdate();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Plants = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ResourceEquipmentPlantUpdate): IResourceEquipmentPlantEntity[] {
		if (complete.Plants === null) {
			complete.Plants = [];
		}

		return complete.Plants;
	}

	protected override checkCreateIsAllowed(entities: IResourceEquipmentPlantEntity[] | IResourceEquipmentPlantEntity | null): boolean {
		if (entities === null) {
			return false;
		}
		//eslint-disable-next-line @typescript-eslint/no-explicit-any
		function isIResourceEquipmentPlantEntity(arg: any): arg is IResourceEquipmentPlantEntity {
			return typeof arg.Matchcode === 'string' && typeof arg.NfcId === 'string' && typeof arg.SerialNumber === 'string' && typeof arg.PlantTypeFk === 'number';
		}
		return isIResourceEquipmentPlantEntity(entities);
	}

	protected takeOverUpdatedFromComplete(complete: ResourceEquipmentPlantUpdate, entityList: IEntityList<IResourceEquipmentPlantEntity>) {
		if (complete && complete.Plants && complete.Plants.length > 0) {
			entityList.updateEntities(complete.Plants);
		}
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IResourceEquipmentPlantEntity>): IEntityProcessor<IResourceEquipmentPlantEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		// allProcessor.push(NewEntityValidationMandatoryFieldProcessorFactory.CreateMandatoryFieldProcessorFromSchemaId(this.validationService, {moduleSubModule: 'Resource.Equipment', typeName: 'EquipmentPlantDto'}));
		return allProcessor;
	}
}