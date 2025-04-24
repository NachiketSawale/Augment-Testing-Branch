/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropData } from '@libs/ui/business-base';
import { DragDropActionType, DragDropConnection, IDragDropTarget } from '@libs/platform/common';
import { IResourceEquipmentPlantEurolistEntity, IResourceCatalogRecordEntity } from '@libs/resource/interfaces';
import { ResourceEquipmentPlantEurolistDataService } from '../data/resource-equipment-plant-eurolist-data.service';
import { ResourceEquipmentPlantDataService } from '../data/resource-equipment-plant-data.service';

export class resourceEquipmentCatalogRecordsEurolistConnection extends DragDropConnection<IResourceCatalogRecordEntity, IResourceEquipmentPlantEurolistEntity> {

	private readonly euroListDataService: ResourceEquipmentPlantEurolistDataService;
	private readonly plantDataService: ResourceEquipmentPlantDataService;

	public constructor(euroListDataService: ResourceEquipmentPlantEurolistDataService, plantDataService: ResourceEquipmentPlantDataService) {
		super('00d61b7a655d47448292f819b321d6a1', 'c779f23a59854b0c9c9960044319d8a4');
		this.euroListDataService = euroListDataService;
		this.plantDataService = plantDataService;
	}

	public override canDrop(draggedDataInfo: IDragDropData<IResourceCatalogRecordEntity>, dropTarget: IDragDropTarget<IResourceEquipmentPlantEurolistEntity>): boolean {
		return !!this.plantDataService.getSelectedEntity();
	}

	public override drop(draggedData: IDragDropData<IResourceCatalogRecordEntity>, dropTarget: IDragDropTarget<IResourceEquipmentPlantEurolistEntity>) {

		this.dropCatalogRecord(draggedData, dropTarget);
	}

	public override allowedActionTypes(draggedDataInfo: IDragDropData<IResourceCatalogRecordEntity> | null): DragDropActionType[] {
		return [DragDropActionType.Copy];
	}

	private dropCatalogRecord(source: IDragDropData<IResourceCatalogRecordEntity>, target: IDragDropTarget<IResourceEquipmentPlantEurolistEntity>): void {
		source.data.forEach((sourceDataItem) => {
			this.euroListDataService.createByCatalogRecord(sourceDataItem);
		});
	}
}