/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantMaintenanceVEntityInfoGenerated } from './generated/resource-equipment-plant-maintenance-v-entity-info-generated.model';
import { IResourceEquipmentPlantMaintenanceVEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantMaintenanceVEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantMaintenanceVEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_MAINTENANCE_V_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantMaintenanceVEntityInfoGenerated,resourceEquipmentPlantMaintenanceVEntityInfo));