/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceEquipmentPlantMaintenanceVEntity } from '@libs/resource/interfaces';

export class ResourceEquipmentPlantMaintenanceVUpdate implements CompleteIdentification<IResourceEquipmentPlantMaintenanceVEntity> {
	public MainItemId: number = 0;
	public PlantMaintenanceVs: IResourceEquipmentPlantMaintenanceVEntity[] | null = [];
}