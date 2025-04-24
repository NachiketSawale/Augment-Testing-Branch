/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantComponentEntityInfoGenerated } from './generated/resource-equipment-plant-component-entity-info-generated.model';
import { IResourceEquipmentPlantComponentEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantComponentEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantComponentEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_COMPONENT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantComponentEntityInfoGenerated,resourceEquipmentPlantComponentEntityInfo));