/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantPricelistEntityInfoGenerated } from './generated/resource-equipment-plant-pricelist-entity-info-generated.model';
import { IResourceEquipmentPlantPricelistEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantPricelistEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantPricelistEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_PRICELIST_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantPricelistEntityInfoGenerated,resourceEquipmentPlantPricelistEntityInfo));