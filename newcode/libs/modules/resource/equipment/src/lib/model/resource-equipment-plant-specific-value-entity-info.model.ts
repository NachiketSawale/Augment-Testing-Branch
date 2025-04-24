/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantSpecificValueEntityInfoGenerated } from './generated/resource-equipment-plant-specific-value-entity-info-generated.model';
import { IResourceEquipmentPlantSpecificValueEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantSpecificValueEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantSpecificValueEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_SPECIFIC_VALUE_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantSpecificValueEntityInfoGenerated,resourceEquipmentPlantSpecificValueEntityInfo));