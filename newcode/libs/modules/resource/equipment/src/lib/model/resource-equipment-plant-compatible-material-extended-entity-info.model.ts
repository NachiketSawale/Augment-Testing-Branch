/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantCompatibleMaterialExtendedEntityInfoGenerated } from './generated/resource-equipment-plant-compatible-material-extended-entity-info-generated.model';
import { IResourceEquipmentPlantCompatibleMaterialExtendedEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantCompatibleMaterialExtendedEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantCompatibleMaterialExtendedEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_COMPATIBLE_MATERIAL_EXTENDED_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantCompatibleMaterialExtendedEntityInfoGenerated,resourceEquipmentPlantCompatibleMaterialExtendedEntityInfo));