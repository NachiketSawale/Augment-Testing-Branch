/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentMaintenanceEntityInfoGenerated } from './generated/resource-equipment-maintenance-entity-info-generated.model';
import { IResourceEquipmentMaintenanceEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentMaintenanceEntityInfo = <Partial<IEntityInfo<IResourceEquipmentMaintenanceEntity>>>{};
export const RESOURCE_EQUIPMENT_MAINTENANCE_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentMaintenanceEntityInfoGenerated,resourceEquipmentMaintenanceEntityInfo));