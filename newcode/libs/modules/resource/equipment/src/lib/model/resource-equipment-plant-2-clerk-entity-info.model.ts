/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlant2ClerkEntityInfoGenerated } from './generated/resource-equipment-plant-2-clerk-entity-info-generated.model';
import { IResourceEquipmentPlant2ClerkEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlant2ClerkEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlant2ClerkEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_2_CLERK_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlant2ClerkEntityInfoGenerated,resourceEquipmentPlant2ClerkEntityInfo));