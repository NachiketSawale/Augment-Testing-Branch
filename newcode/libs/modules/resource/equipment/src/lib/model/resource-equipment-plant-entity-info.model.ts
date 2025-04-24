/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantEntityInfoGenerated } from './generated/resource-equipment-plant-entity-info-generated.model';
import { IResourceEquipmentPlantEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantEntityInfoGenerated,resourceEquipmentPlantEntityInfo));