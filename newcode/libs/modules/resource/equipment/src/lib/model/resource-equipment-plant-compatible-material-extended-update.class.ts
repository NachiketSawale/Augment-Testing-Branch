/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceEquipmentPlantCompatibleMaterialExtendedEntity } from '@libs/resource/interfaces';

export class ResourceEquipmentPlantCompatibleMaterialExtendedUpdate implements CompleteIdentification<IResourceEquipmentPlantCompatibleMaterialExtendedEntity> {
	public MainItemId: number = 0;
	public PlantCompatibleMaterialExtendeds: IResourceEquipmentPlantCompatibleMaterialExtendedEntity[] | null = [];
}