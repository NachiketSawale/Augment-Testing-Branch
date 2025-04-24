/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlant2ControllingUnitEntityInfoGenerated } from './generated/resource-equipment-plant-2-controlling-unit-entity-info-generated.model';
import { IResourceEquipmentPlant2ControllingUnitEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlant2ControllingUnitEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlant2ControllingUnitEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_2_CONTROLLING_UNIT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlant2ControllingUnitEntityInfoGenerated,resourceEquipmentPlant2ControllingUnitEntityInfo));