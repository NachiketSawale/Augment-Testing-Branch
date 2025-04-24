/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantAssignmentEntityInfoGenerated } from './generated/resource-equipment-plant-assignment-entity-info-generated.model';
import { IResourceEquipmentPlantAssignmentEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantAssignmentEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantAssignmentEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_ASSIGNMENT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantAssignmentEntityInfoGenerated,resourceEquipmentPlantAssignmentEntityInfo));