/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantCompatibleMaterialEntityInfoGenerated } from './generated/resource-equipment-plant-compatible-material-entity-info-generated.model';
import { IResourceEquipmentPlantCompatibleMaterialEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantCompatibleMaterialEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantCompatibleMaterialEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_COMPATIBLE_MATERIAL_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantCompatibleMaterialEntityInfoGenerated,resourceEquipmentPlantCompatibleMaterialEntityInfo));