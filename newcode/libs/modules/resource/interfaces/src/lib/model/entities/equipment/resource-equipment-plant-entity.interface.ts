/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IResourceEquipmentPlantEntityGenerated } from './resource-equipment-plant-entity-generated.interface';

export interface IResourceEquipmentPlantEntity extends IResourceEquipmentPlantEntityGenerated {
	HasPoolJobChanged: boolean;
}