/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantCommentEntityInfoGenerated } from './generated/resource-equipment-plant-comment-entity-info-generated.model';
import { IResourceEquipmentPlantCommentEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantCommentEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantCommentEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_COMMENT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantCommentEntityInfoGenerated,resourceEquipmentPlantCommentEntityInfo));