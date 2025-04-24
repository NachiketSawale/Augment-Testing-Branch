/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DragDropBase, DragDropConnection } from '@libs/platform/common';
import { resourceEquipmentCatalogRecordsEurolistConnection } from './resource-equipment-catalog-records-eurolist-connection.class';
import { IResourceEquipmentPlantEurolistEntity } from '@libs/resource/interfaces';
import { ResourceEquipmentPlantEurolistDataService } from '../data/resource-equipment-plant-eurolist-data.service';
import { ResourceEquipmentPlantDataService } from '../data/resource-equipment-plant-data.service';
import { IDragDropData } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentEurolistDragDropService extends DragDropBase<IResourceEquipmentPlantEurolistEntity> {

	private readonly resourceEurolistDataService = inject(ResourceEquipmentPlantEurolistDataService);
	private readonly plantDataService = inject(ResourceEquipmentPlantDataService);

	public constructor() {
		super('c779f23a59854b0c9c9960044319d8a4');
	}

	public override get dragDropConnections(): DragDropConnection<object, IResourceEquipmentPlantEurolistEntity>[] {
		return [
			new resourceEquipmentCatalogRecordsEurolistConnection(this.resourceEurolistDataService, this.plantDataService)
		] as DragDropConnection<object, IResourceEquipmentPlantEurolistEntity>[];
	}

	public override canDrag(draggedDataInfo: IDragDropData<IResourceEquipmentPlantEurolistEntity> | null) {
		return false;
	}

}