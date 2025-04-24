/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import {
	IResourceEquipmentMaintenanceEntity,
	IResourceEquipmentPlantComponentEntity,
	IResourceEquipmentPlantComponentMaintSchemaEntity,
	IResourceEquipmentPlantMeterReadingEntity,
	IResourceEquipmentPlantWarrantyEntity
} from '@libs/resource/interfaces';

export class ResourceEquipmentPlantComponentUpdate implements CompleteIdentification<IResourceEquipmentPlantComponentEntity> {
	public MainItemId: number = 0;
	public PlantComponent: IResourceEquipmentPlantComponentEntity | null = null;
	public MaintenanceToSave: IResourceEquipmentMaintenanceEntity[] | null = [];
	public MaintenanceToDelete: IResourceEquipmentMaintenanceEntity[] | null = [];
	public MeterReadingsToSave: IResourceEquipmentPlantMeterReadingEntity[] | null = [];
	public MeterReadingsToDelete: IResourceEquipmentPlantMeterReadingEntity[] | null = [];
	public PlantComponentMaintSchemaToSave: IResourceEquipmentPlantComponentMaintSchemaEntity[] | null = [];
	public PlantComponentMaintSchemaToDelete: IResourceEquipmentPlantComponentMaintSchemaEntity[] | null = [];
	public WarrantiesToSave: IResourceEquipmentPlantWarrantyEntity[] | null = [];
	public WarrantiesToDelete: IResourceEquipmentPlantWarrantyEntity[] | null = [];
}