/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantPictureEntityInfoGenerated } from './generated/resource-equipment-plant-picture-entity-info-generated.model';
import { IResourceEquipmentPlantPictureEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantPictureEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantPictureEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_PICTURE_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantPictureEntityInfoGenerated,resourceEquipmentPlantPictureEntityInfo));