/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantCostVEntityInfoGenerated } from './generated/resource-equipment-plant-cost-v-entity-info-generated.model';
import { IResourceEquipmentPlantCostVEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantCostVEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantCostVEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_COST_V_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantCostVEntityInfoGenerated,resourceEquipmentPlantCostVEntityInfo));