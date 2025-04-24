/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentBulkPlantOwnerEntityInfoGenerated } from './generated/resource-equipment-bulk-plant-owner-entity-info-generated.model';
import { IResourceEquipmentBulkPlantOwnerEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentBulkPlantOwnerEntityInfo = <Partial<IEntityInfo<IResourceEquipmentBulkPlantOwnerEntity>>>{};
export const RESOURCE_EQUIPMENT_BULK_PLANT_OWNER_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentBulkPlantOwnerEntityInfoGenerated,resourceEquipmentBulkPlantOwnerEntityInfo));