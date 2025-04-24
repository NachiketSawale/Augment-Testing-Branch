/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantAccessoryEntityInfoGenerated } from './generated/resource-equipment-plant-accessory-entity-info-generated.model';
import { IResourceEquipmentPlantAccessoryEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantAccessoryEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantAccessoryEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_ACCESSORY_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantAccessoryEntityInfoGenerated,resourceEquipmentPlantAccessoryEntityInfo));