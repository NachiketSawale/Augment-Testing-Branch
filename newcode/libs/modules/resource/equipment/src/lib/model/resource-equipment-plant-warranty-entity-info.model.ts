/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantWarrantyEntityInfoGenerated } from './generated/resource-equipment-plant-warranty-entity-info-generated.model';
import { IResourceEquipmentPlantWarrantyEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantWarrantyEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantWarrantyEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_WARRANTY_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantWarrantyEntityInfoGenerated,resourceEquipmentPlantWarrantyEntityInfo));