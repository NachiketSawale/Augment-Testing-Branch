/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantAllocVEntityInfoGenerated } from './generated/resource-equipment-plant-alloc-v-entity-info-generated.model';
import { IResourceEquipmentPlantAllocVEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantAllocVEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantAllocVEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_ALLOC_V_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantAllocVEntityInfoGenerated,resourceEquipmentPlantAllocVEntityInfo));